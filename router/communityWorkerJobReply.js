const router = require('koa-router')();
const common = require('../common/common');
const moment = require('moment');
const xss = require('xss');

//数据库配置
const sql = require('../table/communityWorkerJobReply_tab');
const sql1 = require('../table/communityWorkerJob_tab');
const sql2 = require('../table/communityMessage_tab');
let jobModel = new sql(common.sqlconfig);
let replyModel = new sql1(common.sqlconfig);
let messageModel = new sql2(common.sqlconfig);


router.post('post_reply', async ctx => {
  console.log(ctx.request.body)
  if (!await common.userquery(ctx.request.body.unionid, ctx.request.body.communityid)) {
    ctx.body = common.post('[]', 0, '您的身份未认证，无法操作！');
    return;
  }
  let closetype = await replyModel.where({'id': ctx.request.body.id}).field('close_type').find();
  if (closetype.close_type > 0) {
    ctx.body = common.post('[]', 0, '工单已关闭，不支持回复！');
    return;
  }
  let data = await jobModel.add({
    'content': xss(ctx.request.body.content),
    'unionid': ctx.request.body.unionid,
    'jobid': ctx.request.body.id,
    'reply_time': moment().format('YYYY-MM-DD HH:mm:ss'),
    'reply_temp': new Date().getTime() + Math.floor(Math.random()*10000000000000) + ''
  })
  if(ctx.request.body.replytype == 1) {
    await replyModel.where({'id': ctx.request.body.id}).update({'state': '1'})
  } else if(ctx.request.body.replytype == 2) {
    await replyModel.where({'id': ctx.request.body.id}).update({'state': '3'})
    await messageModel.add({'unionid': ctx.request.body.messageunionid, 'type': '1', 'title': '消息通知~', 'content': xss(ctx.request.body.content), 'time': moment().format('YYYY-MM-DD HH:mm:ss')})
  }
  ctx.body = common.post(data);
})
.post('get_reply', async (ctx) => {
  console.log(ctx.request.body)
  // let data = await sqlModel.join([{from: 'demo', on: {unionid: 'unionid'}, field: ['id'], type: 'left'}]).where({id: 247}).find()
  let data = await jobModel.field(['*'])
  .join([
    {from: 'table_user', on: {unionid: 'unionid'}, type: 'left', field: ['nickname', 'head']},
    {from: 'table_worker', on: {unionid: 'unionid'}, type: 'left', field: ['name', 'realhead', 'type']}
  ])
  .where({jobid: ctx.request.body.id})
  .distinct(['reply_temp'])
  .group(['reply_temp'])
  .order({'reply_time': 'asc'})
  .select();
  // let data = await sqlModel.query(`SELECT b.nickname as username,c.name as workername FROM table_worker_jobs_reply as a LEFT JOIN table_user as b ON a.unionid=b.unionid WHERE a.id=?`,[ctx.request.body.id])
  // let data = await sqlModel.query(`SELECT * FROM table_worker_jobs_reply where unionid='${escape(ctx.request.body.unionid)}'`);
  ctx.body = common.post(data);
})


module.exports = router.routes()