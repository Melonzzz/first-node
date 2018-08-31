const router = require('koa-router')();
const common = require('../common/common');
const moment = require('moment');
const xss = require('xss');
const fetch = require('node-fetch');
const FormData = require('form-data');


//数据库配置
const sql = require('../table/communityWorker_tab');
let sqlModel = new sql(common.sqlconfig);
const sql1 = require('../table/communityUser_tab');
let userModel = new sql1(common.sqlconfig);


router.post('get_worker', async ctx => {
  if(ctx.request.body.id){
    let data = await sqlModel.where({'id': ctx.request.body.id}).find();
    ctx.body = common.post(data);
  } else {
    let data = await sqlModel.where({'type': ctx.request.body.type, 'communityid': ctx.request.body.communityid}).select();
    ctx.body = common.post(data);
  }
})
.post('option_worker', async ctx => {
  let obj = {
    'name': xss(ctx.request.body.name),
    'sex': xss(ctx.request.body.sex),
    'mobile': xss(ctx.request.body.mobile),
    'des': xss(ctx.request.body.des),
    'communityid': ctx.request.body.communityid,
    'type': ctx.request.body.type
  }
  if(ctx.request.body.id){ //修改
    if(ctx.request.body.imageArr.indexOf('base64') > 0){
      obj.realhead = JSON.stringify(common.uploadPic(JSON.parse(ctx.request.body.imageArr), 'info'));
    }
    let data = await sqlModel.where({'id': ctx.request.body.id}).update(obj);
    ctx.body = common.post(data);
  } else { //新增
    obj.realhead = JSON.stringify(common.uploadPic(JSON.parse(ctx.request.body.imageArr), 'worker'));
    obj.add_time = moment().format('YYYY-MM-DD HH:mm:ss');
    let data = await sqlModel.add(obj);
    ctx.body = common.post(data);
  }
})
.post('enabled_worker', async (ctx) => {
  let data = null;
  if(ctx.request.body.enabled == 0){
    data = await sqlModel.where({id: ctx.request.body.id}).update({"enabled": ctx.request.body.enabled});
  } else if(ctx.request.body.enabled == 1){
    data = await sqlModel.where({id: ctx.request.body.id}).update({"enabled": ctx.request.body.enabled, 'unionid': ctx.request.body.unionid});
  }
  ctx.body = common.post(data);
})
.post('verify_login', async ctx => {
  let data = await sqlModel.where({mobile: ctx.request.body.mobile, type: ctx.request.body.type == 0?['0','3']:ctx.request.body.type}).find();
  if(Object.keys(data).length == 0){
    ctx.body = common.post([], 0, '该用户不存在！');
  } else {
    ctx.body = common.post(data);
  }
})
.post('workerinfo_login', async ctx => {
  let data = await sqlModel.where({mobile: ctx.request.body.mobile, type: ctx.request.body.type == 0?['0','3']:ctx.request.body.type}).find();
  if(Object.keys(data).length == 0){
    ctx.body = common.post([], 0, '该用户不存在！');
  } else {
    var form = new FormData();
    form.append('mobile', ctx.request.body.mobile);
    form.append('code', ctx.request.body.code);
    const res = await fetch(`${common.phpurl}SDK_WY/api_smsVerify`, { method: 'POST', body: form});
    const body = await res.text();
    console.log(body)
    if(JSON.parse(body).status){
      await sqlModel.where({mobile: ctx.request.body.mobile, type: ctx.request.body.type}).update({enabled: '1', unionid: ctx.request.body.unionid})
      if(ctx.request.body.type == 1){
        ctx.body = common.post(data);
      } else if(ctx.request.body.type == 0 || ctx.request.body.type == 3 || ctx.request.body.type == 4){
        await userModel.where({unionid: ctx.request.body.unionid}).update({'communist': '1'});
        ctx.body = common.post(data);
      }
    } else {
      ctx.body = common.post([], 0, JSON.parse(body).message)
    }
  }
})
.post('room_worker', async ctx => {
  let data = await sqlModel.where({'workroom': ctx.request.body.workroom}).select();
  ctx.body = common.post(data);
})

module.exports = router.routes()