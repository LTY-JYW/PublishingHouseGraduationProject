const express = require('express')
// 创建路由实例
const router = express.Router()
//导入路由处理模块
const books = require('../router_handler/books')

//导入验证模块中间件
const  expressJoi = require('@escook/express-joi')
//导入id验证模块
const { id } = require('../schema/id')
//导入验证模块
const { addBooks,upBooks,selOveryBooks,selCategoryBooks } = require('../schema/books')

//发布图书模块————post请求
router.post('/add',expressJoi(addBooks),books.addBooks)
//删除图书模块————delete请求
router.delete('/delete',expressJoi(id),books.deleteBooks)
// 更新图书模块————post请求
router.post('/update',expressJoi(upBooks),books.updateBooks)
// 查询所有图书模块————get请求
router.get('/overy',expressJoi(selOveryBooks),books.selOveryBooks)
// 查询分类图书模块————get请求
router.get('/categorybook',expressJoi(selCategoryBooks),books.selCatergoryBooks)
// 查询图书详情模块————get请求
router.get('/info',expressJoi(id),books.selInfoBooks)


//导出路由
module.exports = router