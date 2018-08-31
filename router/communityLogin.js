const router = require('koa-router')();
const fetch = require('node-fetch');
const common = require('../common/common');
const FormData = require('form-data');

//数据库配置
const sql = require('../table/communityUser_tab');
let sqlModel = new sql(common.sqlconfig);


router.post('community_weblogin', async (ctx) => {
  //request方法
  // var body = await request('http://www.shiliuapp.net/Server/index.php/data_center/communityList').on('response', function(s,r,b){return b});
  // ctx.body = body;

  //node-fetch方法
  var form = new FormData();
  form.append('unionid', ctx.request.body.unionid);
  // form.append('code', ctx.request.body.code);
  form.append('type', ctx.request.body.type);

  const res = await fetch(`${common.phpurl}login/loginWebAdmin`, { method: 'POST', body: form});
  const body = await res.text();
  ctx.body = body;
})
.post('community_login', async ctx => {
  console.log(ctx.request.body)
  let data = await sqlModel.where({'unionid': ctx.request.body.unionid}).find();
  var form = new FormData();
  form.append('unionid', ctx.request.body.unionid);
  form.append('communityid', ctx.request.body.communityid);
  const res = await fetch(`${common.phpurl}member/queryIdentity`, { method: 'POST', body: form});
  const identity = await res.text();
  common.communityData.communityList.forEach( v => {
    if(v.communityid == data.curcommunityid) {
      data.communityname = v.name;
      data.communitybanner = 'http://www.shiliuapp.net/'+v.banner;
      data.communitybannerID = '231';
      data.identity = JSON.parse(identity).data.identity;
    }
  });;
  if(data.register_time){
    data.hasRegister = true;
  } else {
    data.hasRegister = false;
  };
  ctx.body = common.post(data);
})
.get('wxAuthLocation_login', async ctx => {
  console.log(ctx.request.query)
  ctx.redirect(`http://www.shiliuapp.net/Server/index.php/login_community/wxAuthLocation/?backUrl=${ctx.request.query.backUrl}`);
})


module.exports =router.routes()