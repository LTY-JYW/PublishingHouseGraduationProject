//导入验证模块
const joi = require('joi')
const title = joi.string().required()
const main = joi.string().required()
const page = joi.number().min(1).required()
const itemsPerPage = joi.number().min(1).required()
//发布资讯校验规则
exports.addInformation = {
    body: {
        title,
        main,
    }
}

//查询资讯校验规则
exports.selInformation = {
    query: {
        page,
        itemsPerPage,
    }
}