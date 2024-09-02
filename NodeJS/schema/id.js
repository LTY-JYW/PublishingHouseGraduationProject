//导入验证模块
const joi = require('joi')
const id = joi.number().integer().min(1).required()
const avatar = joi.string().required()

//id验证规则
exports.id = {
    body: {
        id
    }
}

//更新头像验证规则
exports.updata_Pic_schema = {
    body:{
        avatar
    }
}