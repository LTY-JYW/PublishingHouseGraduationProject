const express = require('express')
// 创建路由实例
const router = express.Router()
//导入路由处理模块
const information = require('../router_handler/information')

//导入验证模块中间件
const  expressJoi = require('@escook/express-joi')
//导入验证模块
const { addInformation,selInformation } = require('../schema/information')
// 导入id验证模块
const { id,id_query } = require('../schema/id')

//发布资讯————post请求
router.post('',expressJoi(addInformation),information.add)
// 删除资讯————delete请求
router.delete('',expressJoi(id_query),information.delete)
// 查询资讯————get请求
router.get('',expressJoi(selInformation),information.sel)


//导出路由
module.exports = router