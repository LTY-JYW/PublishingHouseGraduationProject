//导入验证模块
const joi = require('joi')
const name = joi.string().required()
const profile = joi.string().required()
const id = joi.number().integer().min(1).required()
const cid = joi.number().integer().min(1).required()
const cover = joi.string().required()
const page = joi.number().min(1).required()
const itemsPerPage = joi.number().min(1).required()
//发布分类校验规则
exports.addCategory = {
    body: {
        cid,
        name,
        profile,
        cover
    }
}

//查询分类校验规则
exports.selCategory = {
    query: {
        page,
        itemsPerPage,
        cid
    }
}

//查询所有分类校验规则
exports.overySelCategory = {
    query: {
        page,
        itemsPerPage
    }
}

//更新分类校验规则
exports.upCategory = {
    body:{
        id,
        cid,
        name,
        profile,
        cover
    }
}