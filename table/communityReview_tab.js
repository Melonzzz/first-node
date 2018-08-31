const {
  model,
  helper
} = require('thinkorm');

module.exports = class extends model {
  // 构造方法
  init() {
    // 模型名称,映射实体表 user
    this.modelName = 'table_community_review';
    // 数据表字段信息
    this.fields = {
      "id": {
        "pk": true
      },
      "communityid": {
        "defaults": ""
      },
      "areaid": {
        "defaults": ""
      },
      "year": {
        "defaults": ""
      },
      "month": {
        "defaults": ""
      },
      "pro_env": {
        "defaults": ""
      },
      "pro_green": {
        "defaults": ""
      },
      "pro_worker": {
        "defaults": ""
      },
      "pro_device_monitor": {
        "defaults": ""
      },
      "pro_device_fire": {
        "defaults": ""
      },
      "pro_device_pump": {
        "defaults": ""
      },
      "pro_device_lift": {
        "defaults": ""
      },
      "pro_device_magnet": {
        "defaults": ""
      },
      "pro_floorthings": {
        "defaults": ""
      },
      "pro_illegalbuild": {
        "defaults": ""
      },
      "pro_pet": {
        "defaults": ""
      },
      "pro_garbage": {
        "defaults": ""
      },
      "pro_survey": {
        "defaults": ""
      },
      "pro_feedback": {
        "defaults": ""
      },
      "cou_summary": {
        "defaults": ""
      },
      "cou_plan": {
        "defaults": ""
      },
      "cou_finance": {
        "defaults": ""
      },
      "cou_completion": {
        "defaults": ""
      },
      "cou_proevaluate": {
        "defaults": ""
      },
      "cou_survey": {
        "defaults": ""
      },
      "cou_feedback": {
        "defaults": ""
      },
      "add_time": {
        "defaults": ""
      }
    }
  }
}