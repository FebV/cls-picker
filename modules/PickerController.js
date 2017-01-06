const fs = require('fs');
const rp = require('request-promise');

class PickerController {
    constructor({username, password}) {
        this.username = username;
        this.password = password;
        this.cookieToken = null;
        this.classList = [];
        this.loginAuth = this.loginAuth.bind(this);
        this.addPickingClass = this.addPickingClass.bind(this);
        this.removePickingClass = this.removePickingClass.bind(this);
        this.pick = this.pick.bind(this);
    }

    async loginAuth() {
        const lc = new LoginAuthController();
        this.cookieToken = await lc.login({username: this.username, password: this.password});
    }

    addPickingClass({clsID, clsNum}) {
        this.classList.push({clsID, clsNum});
    }

    removePickingClass({clsID}) {
        this.classList = this.classList.filter(val => val.clsID != clsID);
    }

    async pick() {
        if(this.cookieToken === null)
            throw new Error('should login auth first');
        if(this.classList.length === 0)
            throw new Error('should add at least one class first');
        const pc = new PickClassController();
        let res = null;
        await Promise.all(this.classList.map( 
            ele => pc.pickClass({clsID: ele.clsID, clsNum: ele.clsNum, cookie: this.cookieToken}))
        )
        .then(results => {
            res = results;
        });
        return res;
    }

}


class LoginAuthController {
    constructor() {
        this.headers = null;
    }

    async login({username, password}) {
        let cookieToken = null;
        let res = null;
        await rp({
            uri: 'http://bkjwxk.sdu.edu.cn/b/ajaxLogin',
            method: 'post',
            form :{
                j_username: username,
                j_password: password
            },
            resolveWithFullResponse: true,
        })
        .then(response => {
            fs.writeFileSync('result.html', response);
            res = response;
        });
        if(res.body != '"success"')
            throw new Error('password is incorrect');
        cookieToken = res.headers['set-cookie'];
        return cookieToken;
    }

}

class PickClassController {

    async pickClass({clsID, clsNum, cookie}) {
        let resBody = null;
        await rp({
            uri: `http://bkjwxk.sdu.edu.cn/b/xk/xs/add/${clsID}/${clsNum}`,
            method: 'post',
            headers: {
                cookie: cookie
            }
        })
        .then(body => {
            resBody = body;
        });

        return resBody;
    }
}

module.exports = function({username, password}) {
    return new PickerController(...arguments);
}