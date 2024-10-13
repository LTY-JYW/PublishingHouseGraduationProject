const express = require('express')
// 创建路由实例
const router = express.Router()
//导入路由处理模块
const upload = require('../router_handler/uploads')
//导入验证模块中间件
const  expressJoi = require('@escook/express-joi')
//导入校验规则 
const { fileName } = require('../schema/uploads')


//上传图片模块————post请求
router.post('/img',upload.uploadImgFile)
// 上传word模块————post请求
router.post('/word',upload.uploadWordFile)
// word转化html模块————get请求
router.get('/gethtml',expressJoi(fileName),upload.getWordForHtml)


//导出路由
module.exports = router