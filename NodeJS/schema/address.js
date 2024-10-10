//导入验证模块
const { query } = require('express')
const joi = require('joi')

const page = joi.number().min(1).required()
const itemsPerPage = joi.number().min(1).required()

const password = joi.string().pattern(/^[\S]{6,12}$/).required()
const address = joi.string().required()
const id = joi.number().min(1).required()



//添加地址校验规则
exports.address_add_schema = {
    body: {
        address,
    }
}

// 更新地址校验规则
exports.address_up_schema = {
    body: {
        address,
        id
    }
}

// 查询地址校验规则
exports.address_sel_schema = {
    query: {
        page,
        itemsPerPage
    }
}