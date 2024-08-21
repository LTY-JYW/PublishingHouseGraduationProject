//导入验证模块
const joi = require('joi')
const name = joi.string().required()
const profile = joi.string().required()
const id = joi.number().integer().min(1).required()
const cid = joi.number().integer().min(1).required()
//发布分类校验规则
exports.addCategory = {
    body: {
        cid,
        name,
        profile,
    }
}

//查询分类校验规则
exports.selCategory = {
    body: {
        cid
    }
}

//更新分类校验规则
exports.upCategory = {
    body:{
        id,
        name,
        profile
    }
}