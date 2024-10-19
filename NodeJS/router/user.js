const express = require('express')
// 创建路由实例
const router = express.Router()
//导入路由处理模块
const handUser = require('../router_handler/user')
const user = require('../router_handler/userInfo')

//导入验证模块中间件
const  expressJoi = require('@escook/express-joi')
//导入验证模块
const { reg_login_schema } = require('../schema/user')
const { id_query } = require('../schema/id')


//用户注册模块————post请求
router.post('/reguser',expressJoi(reg_login_schema),handUser.reguser)
//用户登录模块————post请求
router.post('/login',expressJoi(reg_login_schema),handUser.login)
// 获取用户列表模块————get请求
router.get('',user.overySelNoPage)
// 配置管理员获取用户信息接口————get请求
router.get('/info',expressJoi(id_query),user.getUserInfoAdminService)
//导出路由
module.exports = router