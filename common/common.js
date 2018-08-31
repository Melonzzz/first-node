const path = require('path');
const fs = require('fs');
const fetch = require('node-fetch');
const FormData = require('form-data');


var commonself = {
  sqlconfig: {
    db_type: 'mysql', // 数据库类型,支持mysql,postgressql,sqlite3
    db_host: 'rm-bp166597mhj0yx944lo.mysql.rds.aliyuncs.com', // 服务器地址
    // db_host: 'rm-bp177o2zcgb49962q.mysql.rds.aliyuncs.com', // 服务器地址
    db_port: 3306, // 端口
    db_name: 'db_brain_community', // 数据库名
    db_user: 'root', // 用户名
    db_pwd: 'Zy328259355', // 密码
    db_prefix: '',
    db_charset: 'utf8',
  },
  post: function (data, status=1, message='success') {
    var post = {data, status:status, message:message, time:new Date().getTime()};
    return post;
  },
  gettoday: function () {
    var date = new Date();
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }
    var currentdate = date.getFullYear() + month + strDate;
    return currentdate;
  },
  gettodayfull: function () {
    var date = new Date();
    var seperator1 = "-";
    var seperator2 = ":";
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    var strhour = date.getHours();
    var strmin = date.getMinutes();
    var strsec = date.getSeconds();
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }
    if (strhour >= 0 && strhour <= 9) {
      strhour = "0" + strhour;
    }
    if (strmin >= 0 && strmin <= 9) {
      strmin = "0" + strmin;
    }
    if (strsec >= 0 && strsec <= 9) {
      strsec = "0" + strsec;
    }
    var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate
            + "&" + strhour + seperator1 + strmin
            + seperator1 + strsec + "&";
    return currentdate;
  },
  checkDirExist: function (ext) {
    if (!fs.existsSync(ext)) {
      fs.mkdirSync(ext);
    }
  },
  getUploadFileExt: function (name) {
    let ext = name.split('.');
    return ext[ext.length - 1];
  },
  getUploadDirName: function () {
    const date = new Date();
    let month = Number.parseInt(date.getMonth()) + 1;
    month = month.toString().length > 1 ? month : `0${month}`;
    const dir = `${date.getFullYear()}${month}${date.getDate()}`;
    return dir;
  },
  communityData: {},
  phpurl: 'http://www.shiliuapp.net/Server/index.php/',
  getCommunityData: async function (){
    const res1 = await fetch(`${commonself.phpurl}data_center/communityList`);
    const data1 = await res1.text();
    const res2 = await fetch(`${commonself.phpurl}data_center/councilList`);
    const data2 = await res2.text();
    commonself.communityData.communityList = JSON.parse(data1).data;
    commonself.communityData.councilList = JSON.parse(data2).data;
  },
  uploadPic: function (arr, path) {
    let imagesArr = []
    arr.forEach( v => {
      let base64 = v.replace(/^data:image\/\w+;base64,/, "");
      let timenow = Date.now();
      let dataBuffer = new Buffer(base64, 'base64');
      fs.writeFile(`resource/image/${path}/${timenow}.png`, dataBuffer, function(err){ //用fs写入文件
        if(err){
            console.log(err);
        }else{
          console.log('文件写入成功！');
        }
      })
      imagesArr.push(`image/${path}/${timenow}.png`)
    });
    return imagesArr;
  },
  filearr: [],
  filenum: 0,
  uploadobj: {
    multipart: true, // 支持文件上传
    // encoding: 'gzip',
    formidable: {
      uploadDir: path.join(__dirname,`../resource/document`), // 设置文件上传目录
      keepExtensions: true,    // 保持文件的后缀
      maxFieldsSize: 1 * 1024 * 1024, // 文件上传大小
      onFileBegin: function (name,file) {
        // 获取文件后缀
        const ext = commonself.getUploadFileExt(file.name);
        // 最终要保存到的文件夹目录
        const dir = path.join(__dirname,`../resource/document/${commonself.gettoday()}`);
        // 检查文件夹是否存在如果不存在则新建文件夹
        commonself.checkDirExist(dir);
        // 获取文件名称
        const fileName = file.name.replace('.'+ext, '');
        // 重新覆盖 file.path 属性
        commonself.filenum++;
        file.path = `${dir}/${Date.now()+''+commonself.filenum+'_'+fileName}.${ext}`;
        commonself.filearr.push(`document/${commonself.gettoday()}/${Date.now()+''+commonself.filenum+'_'+fileName}.${ext}`);
      },
      onError: err => {
        console.log(err);
      }
    }
  },
  userquery: async function (unionid, communityid) {
    let identity = await sqlModel.where({'unionid': unionid}).field(['identity']).find();
    if (identity.identity == undefined) {
      return false;
    } else {
      if (identity.identity <= 0) {
        var form = new FormData();
        form.append('unionid', unionid);
        form.append('communityid', communityid);
        const res = await fetch(`${commonself.phpurl}member/queryIdentity`, { method: 'POST', body: form});
        const data = await res.text();
        if (JSON.parse(data).data.identity <= 0) {
          return false;
        } else {
          return true;
        }
      } else {
        return true;
      }
    }
  }
};

//数据库配置
const sql = require('../table/communityUser_tab');
let sqlModel = new sql(commonself.sqlconfig);

module.exports = commonself;