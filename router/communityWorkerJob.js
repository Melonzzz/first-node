const router = require('koa-router')();
const common = require('../common/common');
const moment = require('moment');
const xss = require('xss');

//数据库配置
const sql = require('../table/communityWorkerJob_tab');
let sqlModel = new sql(common.sqlconfig);


router.post('get_job', async ctx => {
  if(ctx.request.body.id){
    let data = await sqlModel.field(['*'])
    .join([
      {from: 'table_worker', on: {worker: 'unionid'}, type: 'left', field: ['name', 'realhead', 'sex', 'des']},
      {from: 'table_user', on: {asker: 'unionid'}, type: 'left', field: ['nickname', 'head', 'sex as user_sex']}
    ])
    .where({'id': ctx.request.body.id})
    .find();
    ctx.body = common.post(data);
  } else {
    if(ctx.request.body.asker && ctx.request.body.worker) {
      ctx.body = common.post('[]', 0, '不能同时筛选！');
    } else {
      if(ctx.request.body.asker) { //asker列表
        if(ctx.request.body.asker && ctx.request.body.type) {
          let data = await sqlModel.field(['*'])
          .join([{from: 'table_worker', on: {worker: 'unionid', type: 'type'}, type: 'left', field: ['name', 'realhead', 'sex']}])
          .where({'type': ctx.request.body.type, 'asker': ctx.request.body.asker})
          .select();
          ctx.body = common.post(data);
        } else {
          ctx.body = common.post('[]', 0, '参数错误！');
        }
      } else if(ctx.request.body.worker) { //worker列表
        let data = await sqlModel.field(['*'])
          .join([{from: 'table_user', on: {asker: 'unionid'}, type: 'left', field: ['nickname', 'head', 'sex']}])
          .where({'worker': ctx.request.body.worker})
          .select()
        ctx.body = common.post(data);
      }
    }
  }
})
.post('enabled_job', async (ctx) => {
  let data = await sqlModel.where({id: ctx.request.body.id}).update({"close_type": ctx.request.body.enabled, "close_time": moment().format('YYYY-MM-DD HH:mm:ss')});
  ctx.body = common.post(data);
})
.post('option_job', async (ctx) => {
  if (!await common.userquery(ctx.request.body.asker, ctx.request.body.communityid)) {
    ctx.body = common.post('[]', 0, '您的身份未认证，无法操作！');
    return;
  }
  let inglen = await sqlModel.where({worker: ctx.request.body.worker, asker: ctx.request.body.asker, type: ctx.request.body.type, close_type: 0}).select();
  if (inglen.length > 0){
    ctx.body = common.post('[]', 0, '您有未关闭的工单，请勿重复创建！');
    return;
  }
  let data = await sqlModel.add({
    'images': JSON.stringify(common.uploadPic(JSON.parse(ctx.request.body.imageArr), 'workerJob')),
    'worker': xss(ctx.request.body.worker),
    'asker': xss(ctx.request.body.asker),
    'content': xss(ctx.request.body.content),
    'contact': xss(ctx.request.body.contact),
    'type': ctx.request.body.type,
    'creat_time': moment().format('YYYY-MM-DD HH:mm:ss')
  });
  ctx.body = common.post(data);
})
.post('star_job', async ctx => {
  if (ctx.request.body.star > 0 && ctx.request.body.star < 4) {
    let rowdata = await sqlModel.where({'id': ctx.request.body.id}).find();
    if (rowdata.close_type > 0) {
      let data = await sqlModel.where({'id': ctx.request.body.id}).update({'star': ctx.request.body.star});
      ctx.body = common.post(data);
    } else {
      ctx.body = common.post('[]', 0, '工单已关闭，无法继续评价！');
    }
  } else {
    ctx.body = common.post('[]', 0, '请选择正确的评价！');
  }
})
.post('count_job', async ctx => {
  let data_all = await sqlModel.where({worker: ctx.request.body.worker}).count();
  let data_close = await sqlModel.where({worker: ctx.request.body.worker, close_type: 0}).count();
  console.log(data_all, data_close);
  ctx.body = common.post({count_all: data_all, count_close: data_close});
})
.post('new_message_job', async ctx => {
  if(ctx.request.body.worker){
    let data = await sqlModel.where({worker: ctx.request.body.worker, state: {'<': 2}, close_type: '0'}).find();
    if(Object.keys(data) == 0){
      ctx.body = common.post({new_message:0})
    } else {
      ctx.body = common.post({new_message:1})
    }
  } else if (ctx.request.body.asker) {
    let data = await sqlModel.where({asker: ctx.request.body.asker, state: {'=': 3}, close_type: '0'}).find();
    if(Object.keys(data) == 0){
      ctx.body = common.post({new_message:0})
    } else {
      ctx.body = common.post({new_message:1})
    }
  } else {
    ctx.body = common.post('[]', 0, '请发送正确参数~')
  }
})


module.exports = router.routes()