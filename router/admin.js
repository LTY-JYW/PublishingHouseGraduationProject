const express = require('express')
const router = express.Router()

//获取路由逻辑模块
const admin = require('../router_handler/admin')

//管理员封禁用户模块————post请求
router.post('/disable',admin.disable)
//管理员启用用户模块————post请求
router.post('/enable',admin.enable)


//导出路由模块
module.exports = router