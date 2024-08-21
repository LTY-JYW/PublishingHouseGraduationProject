const express = require('express')
// 创建路由实例
const router = express.Router()
//导入路由处理模块
const audit = require('../router_handler/audit')

//导入验证模块中间件
const  expressJoi = require('@escook/express-joi')
//导入验证模块
const { reg_login_schema } = require('../schema/user')

//审核员注册模块————post请求
router.post('/reguser',expressJoi(reg_login_schema),audit.reguser)
//审核员登录模块————post请求
router.post('/login',expressJoi(reg_login_schema),audit.login)
//



//导出路由
module.exports = router