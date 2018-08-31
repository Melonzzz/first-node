const router = require('koa-router')();
const common = require('../common/common');
const moment = require('moment');
const xss = require('xss');
const fetch = require('node-fetch');
const FormData = require('form-data');


//数据库配置
const sql = require('../table/communityWorkroom_tab');
let sqlModel = new sql(common.sqlconfig);



router.post('get_workroom', async ctx => {
  let data = await sqlModel.where({'communityid': ctx.request.body.communityid}).select();
  ctx.body = common.post(data);
})

module.exports = router.routes()