const router = require('koa-router')();
// const request = require('request');
const fetch = require('node-fetch');
const common = require('../common/common');
const FormData = require('form-data');


//数据库配置
const sql = require('../table/communityBuildingInfo_tab');
let sqlModel = new sql(common.sqlconfig);
const sql1 = require('../table/communityWorker_tab');
let workerModel = new sql1(common.sqlconfig);


router.post('community_list', async (ctx) => {
  //request方法
  // var body = await request('http://www.shiliuapp.net/Server/index.php/data_center/communityList').on('response', function(s,r,b){return b});
  // ctx.body = body;

  //node-fetch方法
  const res = await fetch(`${common.phpurl}data_center/communityList`);
  const body = await res.json();
  ctx.body = body;
})
.post('council_list', async ctx => {
  const res = await fetch(`${common.phpurl}data_center/councilList`);
  const body = await res.json();
  ctx.body = body;
})
.post('wxSDK', async ctx => {
  var form = new FormData();
  form.append('url', ctx.request.body.url);
  const res = await fetch(`${common.phpurl}SDK_WX/getSignPackage`, { method: 'POST', body: form});
  const body = await res.json();
  ctx.body = body;
})
.post('chose_community_list', async ctx => {
  ctx.body = common.post(common.communityData);
})
.post('getRoomConfig', async ctx => {
  var form = new FormData();
  form.append('areaid', ctx.request.body.areaid);
  const res = await fetch(`${common.phpurl}data_center/getRoomConfig`, { method: 'POST', body: form});
  const body = await res.json();
  ctx.body = body;
})
.post('feedback_list', async ctx => {
  var form = new FormData();
  form.append('communityid', ctx.request.body.communityid);
  if(ctx.request.body.type)
    form.append('type', ctx.request.body.type);
  const res = await fetch(`${common.phpurl}data_center/getAreaFeedbackInfo`, { method: 'POST', body: form});
  const body = await res.json();
  ctx.body = body;
})
.post('feedback_list_grid', async ctx => {
  let data = await sqlModel.field(['*'])
    .join([{from: 'table_worker', on: {workerid: 'id'}, type: 'left', field: ['name', 'id']}])
    .select();
  ctx.body = common.post(data);
})
.post('getNetFeedback', async ctx => {
  var data_all = {}
  let data = await workerModel.field(['name'])
    .join([{from: 'table_building_info', on: {id: 'workerid'}, type: 'left', field: ['*']}])
    .where({unionid: ctx.request.body.unionid, type: '1'})
    .select();
  if(data.length !== 0){
    var form = new FormData();
    form.append('communityid', ctx.request.body.communityid);
    form.append('type', 1);
    const res = await fetch(`${common.phpurl}data_center/getAreaFeedbackInfo`, { method: 'POST', body: form});
    const body = await res.json();
    data_all.feedback_list = body.data
    data_all.building_info = data
  }
  
  ctx.body = common.post(data_all);
})

module.exports =router.routes()