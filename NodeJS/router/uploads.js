const express = require('express')
// 创建路由实例
const router = express.Router()
//导入路由处理模块
const upload = require('../router_handler/uploads')
//上传模块————post请求
router.post('/upload',upload.uploadFile)


//导出路由
module.exports = router