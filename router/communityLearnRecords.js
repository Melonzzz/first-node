const router = require('koa-router')();
const common = require('../common/common');
const moment = require('moment');
const xss = require('xss');

//数据库配置
const sql = require('../table/communityLearnRecords_tab');
let sqlModel = new sql(common.sqlconfig);


router.post('finished_learn', async ctx => {
  let data = await sqlModel.add({
    'learnid': ctx.request.body.learnid,
    'unionid': ctx.request.body.unionid,
    'learn_time': moment().format('YYYY-MM-DD HH:mm:ss')
  })
  ctx.body = common.post(data);
})

module.exports = router.routes()