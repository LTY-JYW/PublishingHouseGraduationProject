//导入验证模块
const { query } = require('express')
const joi = require('joi')

const page = joi.number().min(1).required()
const itemsPerPage = joi.number().min(1).required()

const password = joi.string().pattern(/^[\S]{6,12}$/).required()


//发布图书校验规则
exports.overyAudit = {
    query: {
        page,
        itemsPerPage
    }
}

//更新用户密码验证规则
exports.update_auditpwd_schema = {
    body:{
        oldPwd:password,
        newPwd:joi.not(joi.ref('oldPwd')).concat(password)
    }
}