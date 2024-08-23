const express = require('express')
// 创建路由实例
const router = express.Router()
//导入路由处理模块
const audit = require('../router_handler/audit')
//导入验证模块中间件
const  expressJoi = require('@escook/express-joi')
//导入验证模块
const { id } = require('../schema/id')
//审核员同意作者模块————post请求
router.post('/isOkAuthor',expressJoi(id),audit.agreeOk)
//审核员驳回作者模块————post请求
router.post('/isNoAuthor',expressJoi(id),audit.agreeNo)
//图书审核通过模块
router.post('/isOkBook',expressJoi(id),audit.bookOk)
//图书审核失败模块
router.post('/isNoBook',expressJoi(id),audit.bookNo)
// 获取审核员模块————get请求
router.get('/getInfo',audit.getAuditInfoService)
//导出路由
module.exports = router