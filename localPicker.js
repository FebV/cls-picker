const pickerController = require('./modules/PickerController');
const cfg = require('./config');

let itv = null;
let count = 0;
const pc = new pickerController(cfg.stu);
pc.addPickingClass(cfg.cls);


async function pick() {
    let re = null;
    try{
        re = await pc.pick();
    }
    catch(e) {
        console.log('正在尝试登录');
        await pc.loginAuth();
    }
    return re;
}


itv = setInterval(async () => {
    const start = Date.now();
    const re = await pick();
    // const result = !/选课失败/.test(JSON.parse(re.res[0].resBody).msg);
    if(!re) {
        console.log(`no response`);
        return;
    } 
    const result = JSON.parse(re.res[0].resBody).result == 'error';
    if( result ) {
        clearInterval(itv);
        console.log(`${re.res[0].resBody}`);
    }
    else {
        console.log(re.res[0].resBody);
        console.log(`失败了 ${++count}`);
    }
    const end = Date.now();
    console.log(`本轮耗时 ${end - start}`);
}, 1000);