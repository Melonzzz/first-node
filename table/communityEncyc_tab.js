
    const {model, helper} = require('thinkorm');

    module.exports = class extends model {
        // 构造方法
        init(){
            // 模型名称,映射实体表 user
            this.modelName = 'table_community_encyc';
            // 数据表字段信息
            this.fields = {
    "id": {
        "pk": true
    },
    "communityid": {
        "defaults": ""
    },
    "type": {
        "defaults": ""
    },
    "sub_type": {
        "defaults": ""
    },
    "creater": {
        "defaults": ""
    },
    "name": {
        "defaults": ""
    },
    "telephone": {
        "defaults": ""
    },
    "address": {
        "defaults": ""
    },
    "opening_time": {
        "defaults": ""
    },
    "images": {
        "defaults": ""
    },
    "des": {
        "defaults": ""
    },
    "rule": {
        "defaults": ""
    },
    "area": {
        "defaults": ""
    },
    "city": {
        "defaults": ""
    },
    "province": {
        "defaults": ""
    },
    "latitude": {
        "defaults": ""
    },
    "longitude": {
        "defaults": ""
    },
    "update_time": {
        "defaults": ""
    },
    "deleted": {
        "defaults": ""
    },
    "verifyed": {
        "defaults": ""
    }
}
        }
    }