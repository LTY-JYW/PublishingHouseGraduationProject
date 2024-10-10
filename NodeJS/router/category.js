const express = require('express')
// 创建路由实例
const router = express.Router()
//导入路由处理模块
const category = require('../router_handler/category')

//导入验证模块中间件
const  expressJoi = require('@escook/express-joi')
//导入验证模块
const { addCategory,selCategory,upCategory } = require('../schema/category')
// 导入id验证模块
const { id,id_query } = require('../schema/id')

//发布分类————post请求
router.post('',expressJoi(addCategory),category.add)
// 删除分类————delete请求
router.delete('',expressJoi(id_query),category.delete)
// 查询分类————get请求
router.get('',expressJoi(selCategory),category.sel)
// 查询分类名列表————get请求
router.get('/name',category.selName)
// 查询分类信息————get请求
router.get('/info',expressJoi(id_query),category.selinfo)
//更新分类————post请求
router.put('',expressJoi(upCategory),category.upData)


//导出路由
module.exports = router