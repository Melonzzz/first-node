const router = require('koa-router')();
const common = require('../common/common');
const moment = require('moment');
const xss = require('xss');

//数据库配置
const sql = require('../table/communityInfo_tab');
const sql1 = require('../table/communityInfosPraise_tab');
const sql2 = require('../table/communityLearnRecords_tab');
const sql3 = require('../table/communityInfosComment_tab');
let sqlModel = new sql(common.sqlconfig);
let infoPraise = new sql1(common.sqlconfig);
let sqlLearn = new sql2(common.sqlconfig);
let infoComment = new sql3(common.sqlconfig);


router.post('get_info', async (ctx) => {
  console.log(ctx.request.body)
  if(ctx.request.body.id){
    let data = await sqlModel.where({'id': ctx.request.body.id}).find();
    ctx.body = common.post(data);
  } else {
    console.log(ctx.request.body.lastid,'111111111')
    if(ctx.request.body.lastid){
      let type = null;
      let data = null;
      if(ctx.request.body.type == 0){
        type = ['11', '12', '13', '21', '22', '23', '31'];
      } else if(ctx.request.body.type == 1){
        type = ['12', '13'];
      } else if(ctx.request.body.type == 2){
        type  = ['21', '22', '23'];
      } else if(ctx.request.body.type == 3){
        type = ['31'];
      } else if(ctx.request.body.type == 4){
        type = ['41'];
      } else {
        type = ctx.request.body.type;
      }
      if(ctx.request.body.lastid == 0){
        data = await sqlModel.where({'type': type, 'communityid': ctx.request.body.communityid, 'deleted': '0'}).order({'id': 'desc'}).limit(0, 10).select();
      } else {
        data = await sqlModel.where({'id': {'<': ctx.request.body.lastid}, 'type': type, 'communityid': ctx.request.body.communityid, 'deleted': '0'}).order({'id': 'desc'}).limit(0, 10).select();
      }
      let praise = await infoPraise.where({'unionid': ctx.request.body.unionid}).select();
      data.forEach( v1 => {
        v1.praise = 0;
        praise.forEach( v2 => {
          if(v1.id == v2.infoid){
            v1.praise = 1;
          }
        })
      });
      ctx.body = common.post(data);
    } else {
      let data = await sqlModel.where({'type': ctx.request.body.type, 'communityid': ctx.request.body.communityid, 'deleted': '0'}).order({'id': 'desc'}).select();
      console.log(data)
      if(ctx.request.body.type == 25){
        if(ctx.request.body.unionid){
          let learn = await sqlLearn.where({'unionid': ctx.request.body.unionid}).select();
          data.forEach( v1 => {
            v1.learned = 0;
            learn.forEach( v2 => {
              if(v1.id == v2.learnid){
                v1.learned = 1;
              }
            })
          });
        }
      }
      ctx.body = common.post(data);
    }
  }
    
})
.post('option_info', async (ctx) => {
  if(ctx.request.body.id){ //修改
    let obj = {
      'title': xss(ctx.request.body.title),
      'sub_title': xss(ctx.request.body.sub_title),
      'can_review': ctx.request.body.can_review?'1':'0',
      'document': xss(ctx.request.body.documentArr),
      'content': ctx.request.body.textarea,
      'communityid': ctx.request.body.communityid,
      'type': ctx.request.body.type
    }
    if(ctx.request.body.imageArr.indexOf('base64') > 0){
      obj.images = JSON.stringify(common.uploadPic(JSON.parse(ctx.request.body.imageArr), 'info'));
    }
    let data = await sqlModel.where({'id': ctx.request.body.id}).update(obj);
    ctx.body = common.post(data);
  } else { //新增
    // let type23 = await sqlModel.where({type: '23', deleted: '0'}).select();
    // console.log(type23)
    // if(ctx.request.body.type == 23 && type23.length > 0){
    //   ctx.body = common.post('[]', 0, '只允许存在一篇概述，请先删除后再添加！');
    //   return;
    // }
    let data = await sqlModel.add({
      'title': xss(ctx.request.body.title),
      'sub_title': xss(ctx.request.body.sub_title),
      'can_review': ctx.request.body.can_review?'1':'0',
      'images': JSON.stringify(common.uploadPic(JSON.parse(ctx.request.body.imageArr), 'info')),
      'document': xss(ctx.request.body.documentArr),
      'content': ctx.request.body.textarea,
      'communityid': ctx.request.body.communityid,
      'type': ctx.request.body.type,
      'add_time': moment().format('YYYY-MM-DD HH:mm:ss')
    });
    ctx.body = common.post(data);
  }
})
.post('delete_info', async (ctx) => {
  console.log(ctx.request.body)
  let data = await sqlModel.where({'id': ctx.request.body.id}).update({'deleted': '1'});
  ctx.body = common.post(data);
})
.post('upload_info', async (ctx) => {
  console.log(ctx.request.body);
  console.log(common.filearr);
  ctx.body = common.post(JSON.stringify(common.filearr));
  common.filearr = [];
  console.log(common.filearr);
})
.post('up_info', async ctx => {
    let num = await infoPraise.where({'infoid': ctx.request.body.id, 'unionid': ctx.request.body.unionid}).find();
    if(num.unionid){
      ctx.body = common.post('[]', 0, '请勿重复点赞！');
    } else {
      let updata = await sqlModel.where({'id': ctx.request.body.id}).increment('count_up',1)
      let insertdata = await infoPraise.add({'infoid': ctx.request.body.id, 'unionid': ctx.request.body.unionid});
      ctx.body = common.post(updata+'&'+insertdata);
    }
})
.post('comment_info', async ctx => {
  let data = await infoComment.add({
    'infoid': ctx.request.body.infoid,
    'unionid': ctx.request.body.unionid,
    'content': ctx.request.body.content,
    'reply_time': moment().format('YYYY-MM-DD HH:mm:ss')
  })
  ctx.body = common.post(data);
})
.post('get_comment_info', async ctx => {
  let infoid = await sqlModel.where({type: ctx.request.body.type, 'communityid': ctx.request.body.communityid}).field(['id']).select()
  let infoid_arr = [];
  infoid.forEach(v => {
    infoid_arr.push(v.id)
  })
  let data;
  console.log(infoid_arr)
  if(ctx.request.body.lastid == 0){
    data = await infoComment.field(['*'])
      .join([
        {from: 'table_community_infos', on: {infoid: 'id'}, type: 'left', field: ['title']},
        {from: 'table_user', on: {unionid: 'unionid'}, type: 'left', field: ['nickname', 'head']}
      ])
      .where({'infoid': infoid_arr})
      .order({'id': 'desc'})
      .limit(0, 10)
      .select();
  } else {
    data = await infoComment.field(['*'])
      .join([
        {from: 'table_community_infos', on: {infoid: 'id'}, type: 'left', field: ['title']},
        {from: 'table_user', on: {unionid: 'unionid'}, type: 'left', field: ['nickname', 'head']}
      ])
      .where({'id': {'<': ctx.request.body.lastid}, 'communityid': ctx.request.body.communityid, 'infoid': infoid_arr})
      .order({'id': 'desc'})
      .limit(0, 10)
      .select();
  }
  ctx.body = common.post(data);
})

module.exports = router.routes();
