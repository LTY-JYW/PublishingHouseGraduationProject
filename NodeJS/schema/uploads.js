//导入验证模块
const { query } = require('express')
const joi = require('joi')
const fileName = joi.string().required()

//id验证规则
exports.fileName = {
    query: {
        fileName
    }
}