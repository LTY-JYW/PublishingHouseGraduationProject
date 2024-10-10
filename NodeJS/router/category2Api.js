const express = require('express')
// 创建路由实例
const router = express.Router()
//导入路由处理模块
const category2 = require('../router_handler/category2')

//导入验证模块中间件
const  expressJoi = require('@escook/express-joi')
//导入验证模块
const { addCategory,selCategory,upCategory,overySelCategory } = require('../schema/category2')
// 导入id验证模块
const { id,id_query } = require('../schema/id')

// 获取所有分类————get请求
router.get('/overy',expressJoi(overySelCategory),category2.overySel)

// 获取一级和二级分类————get请求
router.get('',category2.categoryOvery)


//导出路由
module.exports = router