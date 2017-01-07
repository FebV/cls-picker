const pickerController = require('./modules/PickerController');

const Koa = require('koa');
const app = new Koa();
const router = require('koa-router')();
const bodyParser = require('koa-bodyparser');

// app.use((ctx, next) => {
//     const ipprefix = ctx.ip.slice(7, 14);
//     if( ipprefix != '121.250' && ipprefix != '211.87')
//         ctx.body == `sorry for those whose ip don't belong to sdu`;
//     else
//         next();
// })

app.use(bodyParser());

router.get('/', (ctx, next) => {
    ctx.body = 'index page for cls-picker';
})

router.get('/api', (ctx, next) => {
    ctx.body = 'api index page for cls-picker';
})

router.post('/api/users', (ctx, next) => {
    const newUser = ctx.request.body;
    if(pickers.filter(val => val.username == newUser.username) == 0)
        pickers.push(new pickerController(newUser));
})

router.post('/api/class', (ctx, next) => {
    const {token, clsID, clsNum} = ctx.request.body;
    pickers.map(val => {
        if(val.username == token)
            val.addPickingClass({clsID, clsNum});
    })
})

router.get('/api/status', (ctx, next) => {
    console.log(JSON.stringify(pickers));
    ctx.body = 'status';
})

router.get('/api/pick', async (ctx, next) => {
    await pick();
})

app.use(router.routes());
app.listen(3000);

// let users = [];
let pickers = [];

async function pick() {
    pickers.map(async val => {
        if(val.cookieToken === null) {
            try{
                await val.loginAuth();
            }
            catch(e) {
                pickers = pickers.filter(ele => ele.username != val.username);
                console.log(`${val.username} has been removed for wrong username/password`);
                return;
            }
        }
        if(val.classList.length === 0) {
            console.log(`no class list for ${val.realName}`);
            return;
        }
        const pickingResults = await val.pick();
        results = pickingResults.res;
        results.map(ele => {
            row = JSON.parse(ele.resBody);
            if( row.result == 'error') {
                // console.log(`${val.realName} ${row.msg}`);
                // console.log(`${/\[(..\d+)/.exec(row.msg)[1]} has been removed for ${val.realName}`);
                val.removePickingClass(ele.clsID);
                console.log(`${ele.clsID} has been removed for reason ${row.msg}`);
                return;
            }
        })
        console.log(`${val.realName}  ${pickingResults}`);
    });
}
 
// setInterval(() => {
//     dispatchPicker();
//     console.log('dispatch');
//     pick();
//     console.log('pick');
// }, 1000);