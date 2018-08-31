const koa = require('koa');
const router = require('koa-router')();
const static = require('koa-static');
const koaBody = require('koa-body');
// const path = require('path');
const cors = require('koa2-cors');
const compress = require('koa-compress')
//myself
const common = require('./common/common');


var app = new koa();
app.listen(80, '192.168.0.122', function(){
  console.log('server STAR............');
});
common.getCommunityData();

// logger
// app.use(async (ctx, next) => {
//   const start = new Date()
//   await next()
//   const ms = new Date() - start
//   console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
// })

//设置跨域header
app.use(cors());

app.use(compress({threshold: 2048}));

//解析form
app.use(koaBody(common.uploadobj), async (ctx,next) => {
  await next();
})

//全局捕获报错
app.use(async (ctx,next) => {
  try {
    await next();
  } catch (err) {
    ctx.response.status = err.statusCode || err.status || 500;
    console.log('接口:', ctx.url, new Date().toString());
    console.log('错误信息:', err.message, new Date().toString());
    console.log('');
    ctx.response.body = common.post('[]', 0, err.message);
  }
})

//router
router.use('/communityInfo/', require('./router/communityInfo'));
router.use('/communityData/', require('./router/communityData'));
router.use('/communityUser/', require('./router/communityUser'));
router.use('/communityLogin/', require('./router/communityLogin'));
router.use('/communityEncyc/', require('./router/communityEncyc'));
router.use('/communityReview/', require('./router/communityReview'));
router.use('/communityWorkroom/', require('./router/communityWorkroom'));
router.use('/communityWorker/', require('./router/communityWorker'));
router.use('/communityWorkerJob/', require('./router/communityWorkerJob'));
router.use('/communityWorkerJobReply/', require('./router/communityWorkerJobReply'));
router.use('/communityLearnRecords/', require('./router/communityLearnRecords'));

app.use(router.routes()).use(router.allowedMethods());
app.use(static(
  '../Pro_APP/Admin_Community',
  { 
    maxage: 315360000, 
    gzip: true 
  }
));
// app.use(static('../Pro_APP/Admin_Community'));
app.use(static(
  './resource',
  { 
    maxage: 315360000, 
    gzip: true 
  }
));
