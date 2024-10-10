const express = require('express')
// 创建路由实例
const router = express.Router()
//导入路由处理模块
const information = require('../router_handler/information')

//导入验证模块中间件
const  expressJoi = require('@escook/express-joi')
//导入验证模块
const { selNoDelBooks } = require('../schema/books')
// 导入id验证模块
const { id,id_query } = require('../schema/id')

// 查询资讯————get请求
router.get('',expressJoi(selNoDelBooks),information.sel)
// 查询审核通过资讯————get请求
router.get('/approved',expressJoi(selNoDelBooks),information.selApproved)
// 查询资讯详细信息————get请求
router.get('/info',expressJoi(id_query),information.selInfo)
// 浏览资讯————post请求
router.post('',expressJoi(id),information.views)


//导出路由
module.exports = router