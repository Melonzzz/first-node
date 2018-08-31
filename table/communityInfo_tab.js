const {model, helper} = require('thinkorm');

module.exports = class extends model {
    // 构造方法
    init(){
        // 模型名称,映射实体表 user
        this.modelName = 'table_community_infos';
        // 数据表字段信息
        this.fields = {
            'id': {
              'pk': true
            },
            'communityid': {
              'defaults': ''
            },
            'type': {
              'defaults': ''
            },
            'title': {
              'defaults': ''
            },
            'sub_title': {
              'defaults': ''
            },
            'can_review': {
              'defaults': ''
            },
            'content': {
              'defaults': ''
            },
            'images': {
              'defaults': ''
            },
            'document': {
              'defaults': ''
            },
            'submitter': {
              'defaults': ''
            },
            'count_view': {
              'defaults': ''
            },
            'count_up': {
              'defaults': ''
            },
            'count_down': {
              'defaults': ''
            },
            'deleted': {
              'defaults': ''
            },
            'add_time': {
              'defaults': ''
            }
        };
    }
}