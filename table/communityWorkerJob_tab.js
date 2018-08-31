const {
  model,
  helper
} = require('thinkorm');

module.exports = class extends model {
  // 构造方法
  init() {
    // 模型名称,映射实体表 user
    this.modelName = 'table_worker_jobs';
    // 数据表字段信息
    this.fields = {
      "id": {
        "pk": true
      },
      "worker": {
        "defaults": ""
      },
      "asker": {
        "defaults": ""
      },
      "type": {
        "defaults": ""
      },
      "content": {
        "defaults": ""
      },
      "contact": {
        "defaults": ""
      },
      "images": {
        "defaults": ""
      },
      "state": {
        "defaults": ""
      },
      "star": {
        "defaults": ""
      },
      "creat_time": {
        "defaults": ""
      },
      "close_time": {
        "defaults": ""
      },
      "close_type": { 
        "defaults": ""
      }
    }
  }
}