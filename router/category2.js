const express = require('express')
// 创建路由实例
const router = express.Router()
//导入路由处理模块
const category2 = require('../router_handler/category2')

//导入验证模块中间件
const  expressJoi = require('@escook/express-joi')
//导入验证模块
const { addCategory,selCategory,upCategory } = require('../schema/category2')
// 导入id验证模块
const { id } = require('../schema/id')

//发布分类————post请求
router.post('/add',expressJoi(addCategory),category2.add)
// 删除分类————delete请求
router.delete('/delete',expressJoi(id),category2.delete)
// 查询分类————get请求
router.get('/sel',expressJoi(selCategory),category2.sel)
//更新分类————post请求
router.post('/updata',expressJoi(upCategory),category2.upData)


//导出路由
module.exports = router