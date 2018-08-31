const router = require('koa-router')();
const common = require('../common/common');
const moment = require('moment');
const xss = require('xss');

//数据库配置
const sql = require('../table/communityReview_tab');
let sqlModel = new sql(common.sqlconfig);


router.post('get_review', async (ctx) => {
  console.log(ctx.request.body)
  if(ctx.request.body.id){
    let data = await sqlModel.where({'id': ctx.request.body.id}).find();
    ctx.body = common.post(data);
  } else {
    let data = await sqlModel.where({'communityid': ctx.request.body.communityid}).select();
    ctx.body = common.post(data);
  }
})
.post('option_review', async (ctx) => {
  console.log(ctx.request.body)
  let obj = {
    'pro_env': xss(ctx.request.body.pro_env),
    'pro_green': xss(ctx.request.body.pro_green),
    'pro_worker': xss(ctx.request.body.pro_worker),
    'pro_device_monitor': xss(ctx.request.body.pro_device_monitor),
    'pro_device_fire': xss(ctx.request.body.pro_device_fire),
    'pro_device_pump': xss(ctx.request.body.pro_device_pump),
    'pro_device_lift': xss(ctx.request.body.pro_device_lift),
    'pro_device_magnet': xss(ctx.request.body.pro_device_magnet),
    'pro_floorthings': xss(ctx.request.body.pro_floorthings),
    'pro_illegalbuild': xss(ctx.request.body.pro_illegalbuild),
    'pro_pet': xss(ctx.request.body.pro_pet),
    'pro_garbage': xss(ctx.request.body.pro_garbage),
    'pro_survey': xss(ctx.request.body.pro_survey),
    'pro_feedback': xss(ctx.request.body.pro_feedback),
    'cou_summary': xss(ctx.request.body.cou_summary),
    'cou_plan': xss(ctx.request.body.cou_plan),
    'cou_finance': xss(ctx.request.body.cou_finance),
    'cou_completion': xss(ctx.request.body.cou_completion),
    'cou_proevaluate': xss(ctx.request.body.cou_proevaluate),
    'cou_survey': xss(ctx.request.body.cou_survey),
    'cou_feedback': xss(ctx.request.body.cou_feedback)
  }
  if(ctx.request.body.id){ //修改
    let data = await sqlModel.where({'id': ctx.request.body.id}).update(obj);
    ctx.body = common.post(data);
  } else { //新增
    if(ctx.request.body.year < 2018){
      ctx.body = common.post('[]', 0, '添加失败，请选择正确的年份！');
      return;
    }
    let repeat = await sqlModel.where({communityid: ctx.request.body.communityid, month: ctx.request.body.month, year: ctx.request.body.year}).select();
    if(repeat.length > 0){
      ctx.body = common.post('[]', 0, '添加失败，每月只允许存在一篇考核！');
      return;
    }
    obj.communityid = xss(ctx.request.body.communityid);
    obj.areaid = xss(ctx.request.body.areaid);
    obj.year = xss(ctx.request.body.year);
    obj.month = xss(ctx.request.body.month);
    obj.add_time = moment().format('YYYY-MM-DD HH:mm:ss');
    let data = await sqlModel.add(obj);
    ctx.body = common.post(data);
  }
})


module.exports = router.routes();
