const express = require('express')
// 创建路由实例
const router = express.Router()
//导入路由处理模块
const cart = require('../router_handler/cart')

//导入验证模块中间件
const  expressJoi = require('@escook/express-joi')
//导入id验证模块
const { id } = require('../schema/id')
//导入验证模块
const { addCart,upCart,overycart } = require('../schema/cart')

//添加购物车模块————post请求
router.post('',expressJoi(addCart),cart.addCart)
//删除购物车模块————delete请求
router.delete('',expressJoi(id),cart.delCart)
// 修改购物车数量————post请求
router.put('',expressJoi(upCart),cart.upCart)
// 查询用户的购物车————get请求
router.get('',expressJoi(overycart),cart.getCart)


//导出路由
module.exports = router