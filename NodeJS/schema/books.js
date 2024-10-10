//导入验证模块
const joi = require('joi')

const cid = joi.number().min(1).required()
const name = joi.string().required()
const profile = joi.string().required()
const edition = joi.number().min(1).required()
const price = joi.number().min(1).required()
const pages = joi.number().min(1).required()
const number = joi.number().min(1).required()
const topic = joi.string().required()
const cover = joi.string().required()
const id = joi.number().min(1).required()

const page = joi.number().min(1).required()
const itemsPerPage = joi.number().min(1).required()
const by = joi.string().required()
const des = joi.string().required()
//发布图书校验规则
exports.addBooks = {
    body: {
        cid,
        name,
        profile,
        edition,
        price,
        pages,
        number,
        topic,
        cover,
    }
}
// 更新图书校验规则
exports.upBooks = {
    body: {
        id,
        cid,
        name,
        profile,
        edition,
        price,
        pages,
        number,
        topic,
        cover,
    }
}

// 查询所有图书校验规则
exports.selOveryBooks = {
    query: {
        page,
        itemsPerPage,
    }
}
// 查询未删除图书校验规则
exports.selNoDelBooks = {
    query: {
        page,
        itemsPerPage,
        by,
        des
    }
} 
// 查询未删除图书(不分页)校验规则
exports.selNoDelNoPageBooks = {
    query: {
        by,
        des
    }
} 
// 查询分类对应图书校验规则
exports.selCategoryBooks = {
    body: {
        page,
        itemsPerPage,
        cid
    }
}