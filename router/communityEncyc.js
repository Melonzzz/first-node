const router = require('koa-router')();
const common = require('../common/common');
const moment = require('moment');
const xss = require('xss');

//数据库配置
const sql = require('../table/communityEncyc_tab');
let sqlModel = new sql(common.sqlconfig);

router.post('get_encyc', async (ctx) => {
  console.log(ctx.request.body)
  if(ctx.request.body.id){
    let data = await sqlModel.where({id: ctx.request.body.id}).find();
    ctx.body = common.post(data);
  } else {
    let data = await sqlModel.where({'type': ctx.request.body.type, 'communityid': ctx.request.body.communityid, 'deleted': '0'}).field(['id', 'name', 'images', 'opening_time', 'address', 'telephone', 'des']).select();
    ctx.body = common.post(data);
  }
})
.post('delete_encyc', async (ctx) => {
  console.log(ctx.request.body);
  let data = await sqlModel.where({'id': ctx.request.body.id}).update({'deleted': '1'});
  ctx.body = common.post(data);
})
.post('option_encyc', async (ctx) => {
  let obj = {
    'name': xss(ctx.request.body.name),
    'telephone': xss(ctx.request.body.telephone),
    'address': xss(ctx.request.body.address),
    'des': xss(ctx.request.body.des),
    'area': xss(ctx.request.body.area),
    'city': xss(ctx.request.body.city),
    'province': xss(ctx.request.body.province),
    'communityid': ctx.request.body.communityid,
    'type': ctx.request.body.type,
    'longitude': ctx.request.body.longitude,
    'rule': ctx.request.body.rule,
    'opening_time': ctx.request.body.opening_time,
    'latitude': ctx.request.body.latitude,
    'update_time': moment().format('YYYY-MM-DD HH:mm:ss')
  }
  if(ctx.request.body.id){ //修改
    if(ctx.request.body.imageArr.indexOf('base64') > 0){
      obj.images = JSON.stringify(common.uploadPic(JSON.parse(ctx.request.body.imageArr), 'encyc'));
    }
    let data = await sqlModel.where({'id': ctx.request.body.id}).update(obj);
    ctx.body = common.post(data);
  } else { //新增
    obj.images = JSON.stringify(common.uploadPic(JSON.parse(ctx.request.body.imageArr), 'encyc'));
    let data = await sqlModel.add(obj);
    ctx.body = common.post(data);
  }
})


module.exports =router.routes()