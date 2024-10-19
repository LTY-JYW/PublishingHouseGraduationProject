const express = require('express')
// 创建路由实例
const router = express.Router()
//导入路由处理模块
const books = require('../router_handler/books')

//导入验证模块中间件
const  expressJoi = require('@escook/express-joi')
//导入id验证模块
const { id_query,id } = require('../schema/id')  
//导入验证模块
const { selNoDelBooks,selNoDelNoPageBooks,selCategoryBooks } = require('../schema/books')

// 查询所有未删除图书模块————get请求
router.get('/overy',expressJoi(selNoDelBooks),books.selOveryBooks)
// 查询所有未删除图书模块(不分页)————get请求
router.get('/overyNo',expressJoi(selNoDelNoPageBooks),books.selOveryNoPageBooks)
// 查询图书详情模块————get请求
router.get('/info',expressJoi(id_query),books.selInfoBooks)
// 查询作者图书模块————get请求
router.get('/users',expressJoi(id_query),books.selUsersBooks)
// 查询分类图书模块————get请求
router.get('/categorybook',expressJoi(selCategoryBooks),books.selCatergoryBooks)
// 搜索图书模块————get请求
router.get('/search',books.selBooksName)
//导出路由
module.exports = router