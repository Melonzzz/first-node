const router = require('koa-router')();
const fetch = require('node-fetch');
const common = require('../common/common');
const FormData = require('form-data');
const xss = require('xss');
const moment = require('moment');


//数据库配置
const sql = require('../table/communitySuggest_tab');
const sql1 = require('../table/communityUser_tab');
const sql2 = require('../table/communityMessage_tab');
let suggestModel = new sql(common.sqlconfig);
let userModel = new sql1(common.sqlconfig);
let messageModel = new sql2(common.sqlconfig);


router.post('suggest_user', async ctx => {
  let data = await suggestModel.add({
    'content': xss(ctx.request.body.content),
    'contact': xss(ctx.request.body.contact),
    'unionid': xss(ctx.request.body.unionid),
    'communityid': ctx.request.body.communityid,
    'add_time': moment().format('YYYY-MM-DD HH:mm:ss')
  });
  ctx.body = common.post(data);
})
.post('suggestList_user', async ctx => {
  let data = await suggestModel.field(['*'])
  .join([{from: 'table_user', on: {unionid: 'unionid'}, type: 'left', field: ['nickname']}])
  .where({'communityid': ctx.request.body.communityid})
  .select();
  ctx.body = common.post(data);
})
.post('smsSend_user', async ctx => {
  var form = new FormData();
  form.append('mobile', ctx.request.body.mobile);

  const res = await fetch(`${common.phpurl}SDK_WY/smsSend`, { method: 'POST', body: form});
  const body = await res.text();
  ctx.body = body;
})
.post('apply_user', async ctx => {
  var form = new FormData();
  form.append('unionid', ctx.request.body.unionid);
  form.append('areaid', ctx.request.body.areaid);
  form.append('name', ctx.request.body.name);
  form.append('sex', ctx.request.body.sex);
  form.append('mobile', ctx.request.body.mobile);
  form.append('cardid', ctx.request.body.cardid);
  form.append('enter_time', ctx.request.body.enter_time);
  form.append('building', ctx.request.body.building);
  form.append('unit', ctx.request.body.unit);
  form.append('room', ctx.request.body.room);
  form.append('smscode', ctx.request.body.smscode);
  form.append('type', ctx.request.body.type);
  const res = await fetch(`${common.phpurl}member_apply/userApply`, { method: 'POST', body: form});
  const body = await res.text();
  ctx.body = body;
})
.post('community_user', async ctx => {
  let data = await userModel.where({'unionid': ctx.request.body.unionid}).update({'curcommunityid': ctx.request.body.curcommunityid});
  ctx.body = common.post(data);
})
.post('message_user', async ctx => {
  let data = await messageModel.where({'unionid': ctx.request.body.unionid}).select();
  await messageModel.where({'unionid': ctx.request.body.unionid}).update({'read': '1'})
  ctx.body = common.post(data);
})
.post('register_user', async ctx => {
  let data = await userModel.where({'unionid': ctx.request.body.unionid}).update({'register_time': moment().format('YYYY-MM-DD HH:mm:ss')})
  ctx.body = common.post(data);
})
.post('identity_user', async ctx => {
  var form = new FormData();
  form.append('unionid', ctx.request.body.unionid);
  form.append('communityid', ctx.request.body.communityid);
  const res = await fetch(`${common.phpurl}member/queryIdentity`, { method: 'POST', body: form});
  const data = await res.text();
  ctx.body = data;
})
.post('webcommunity_user', async ctx => {
  var form = new FormData();
  form.append('unionid', ctx.request.body.unionid);
  form.append('communityid', ctx.request.body.communityid);
  const res = await fetch(`${common.phpurl}user/adminCommunitySelect`, { method: 'POST', body: form});
  const data = await res.text();
  ctx.body = data;
})

module.exports =router.routes()