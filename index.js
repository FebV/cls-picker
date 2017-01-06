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
    if(users.filter(val => val.username == newUser) == 0)
        users.push(newUser);
})

router.get('/api/status', (ctx, next) => {
    console.log(JSON.stringify(users));
    console.log(JSON.stringify(pickers));
    ctx.body = 'status';
})

app.use(router.routes());
app.listen(3000);

// let users = [];
// let pickers = [];

// async function pick() {
//     pickers.map(async val => {
//         if(val.cookieToken === null) {
//             try{
//                 await val.loginAuth();
//             }
//             catch(e) {
//                 users = users.filter(ele => ele.username != val.username);
//                 pickers = pickers.filter(ele => ele.username != val.username);
//             }
//         }
//         const result = await val.pick();
//         console.log(val.username + result);
//     })
//     // const pc = pickerController({username: '201400301165', password: '555751'});
//     // await pc.loginAuth();

//     // pc.addPickingClass({clsID: 'sd03030310', clsNum: '100'});
//     // pc.addPickingClass({clsID: 'sd03031340', clsNum: '0'});
//     // pc.removePickingClass({clsID: 'sd03031340', clsNum: '0'});
//     // const result = await pc.pick();
//     // console.log(result);
// };

// function dispatchPicker() {
//     for(let u of users) {
//         if(pickers.filter(val => val.username == u.username).length == 0)
//             pickers.push(pickerController(u));
//     }
// }

// setInterval(() => {
//     dispatchPicker();
//     console.log('dispatch');
//     pick();
//     console.log('pick');
// }, 1000);