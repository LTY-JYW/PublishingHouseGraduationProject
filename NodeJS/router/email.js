const express = require('express')
// 创建路由实例
const router = express.Router()
//导入路由处理模块
const email = require('../router_handler/email.js')


//发布分类————post请求
router.post('',email.email)



//导出路由
module.exports = router