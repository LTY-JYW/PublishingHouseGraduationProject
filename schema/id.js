//导入验证模块
const joi = require('joi')
const id = joi.number().integer().min(1).required()

//id验证规则
exports.id = {
    body: {
        id
    }
}
