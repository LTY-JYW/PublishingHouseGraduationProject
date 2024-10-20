//导入验证模块
const joi = require('joi')
const bid = joi.number().min(1).required()
const uid = joi.number().min(1).required()


const page = joi.number().min(1).required()
const itemsPerPage = joi.number().min(1).required()
//发布资讯校验规则
exports.order_add_schema = {
    body: {
        bid, 
    }
}

//查询资讯校验规则
exports.order_sel_schema = {
    query: {
        page,
        itemsPerPage,
    }
}