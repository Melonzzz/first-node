const {
  model,
  helper
} = require('thinkorm');

module.exports = class extends model {
  // 构造方法
  init() {
    // 模型名称,映射实体表 user
    this.modelName = 'table_user';
    // 数据表字段信息
    this.fields = {
      "id": {
        "pk": true
      },
      "unionid": {
        "defaults": ""
      },
      "name": {
        "defaults": ""
      },
      "cardid": {
        "defaults": ""
      },
      "mobile": {
        "defaults": ""
      },
      "nickname": {
        "defaults": ""
      },
      "sex": {
        "defaults": ""
      },
      "head": {
        "defaults": ""
      },
      "identity": {
        "defaults": ""
      },
      "curcommunityid": {
        "defaults": ""
      },
      "fromareaid": {
        "defaults": ""
      },
      "register_time": {
        "defaults": ""
      },
      "communist": {
        "defaults": ""
      }
    }
  }
}