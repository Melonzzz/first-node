
    const {model, helper} = require('thinkorm');

    module.exports = class extends model {
        // 构造方法
        init(){
            // 模型名称,映射实体表 user
            this.modelName = 'table_building_info';
            // 数据表字段信息
            this.fields = {
    "id": {
        "pk": true
    },
    "areaid": {
        "defaults": ""
    },
    "building": {
        "defaults": ""
    },
    "unit": {
        "defaults": ""
    },
    "net": {
        "defaults": ""
    },
    "workerid": {
        "defaults": ""
    }
}
        }
    }