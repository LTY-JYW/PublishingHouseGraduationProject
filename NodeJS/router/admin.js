const express = require('express')
const router = express.Router()

//获取路由逻辑模块
const admin = require('../router_handler/admin')
//导入验证模块中间件
const  expressJoi = require('@escook/express-joi')
//导入验证模块
const { id } = require('../schema/id')
//管理员封禁用户模块————post请求
router.post('/disable',expressJoi(id),admin.disable)
//管理员启用用户模块————post请求
router.post('/enable',expressJoi(id),admin.enable)
// 获取管理员信息模块————get请求
router.get('/getInfo',admin.getAdminInfoService)


//导出路由模块
module.exports = router