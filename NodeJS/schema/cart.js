//导入验证模块
const joi = require('joi')

const id = joi.number().min(1).required()
const bid = joi.number().min(1).required()
const count = joi.number().min(1).required()

const page = joi.number().min(1).required()
const itemsPerPage = joi.number().min(1).required()
//添加购物车校验规则
exports.addCart = {
    body: {
        bid,
    }
}

exports.upCart = {
    body:{
        id,
        count
    }
}

// 查询用户购物车校验规则 
//发布图书校验规则
exports.overycart = {
    query: {
        page,
        itemsPerPage
    }
}