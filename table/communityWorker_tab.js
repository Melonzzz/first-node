
    const {model, helper} = require('thinkorm');

    module.exports = class extends model {
        // 构造方法
        init(){
            // 模型名称,映射实体表 user
            this.modelName = 'table_worker';
            // 数据表字段信息
            this.fields = {
    "id": {
        "pk": true
    },
    "unionid": {
        "defaults": ""
    },
    "communityid": {
        "defaults": ""
    },
    "type": {
        "defaults": ""
    },
    "name": {
        "defaults": ""
    },
    "sex": {
        "defaults": ""
    },
    "mobile": {
        "defaults": ""
    },
    "cardid": {
        "defaults": ""
    },
    "des": {
        "defaults": ""
    },
    "realhead": {
        "defaults": ""
    },
    "enabled": {
        "defaults": ""
    },
    "workroom": {
        "defaults": ""
    },
    "add_time": {
        "defaults": ""
    }
}
        }
    }