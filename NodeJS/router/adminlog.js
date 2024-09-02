const express = require('express')
const router = express.Router()

//导入验证模块所需要的中间件
const  expressJoi = require('@escook/express-joi')
//导入创建好的验证模块
const { reg_login_schema } = require('../schema/user')

//获取路由逻辑模块
const admin = require('../router_handler/admin')

//管理员注册模块————post请求
router.post('/reguser',expressJoi(reg_login_schema),admin.reguser)
//管理员登录模块————post请求
router.post('/login',expressJoi(reg_login_schema),admin.login)

//导出路由模块
module.exports = router