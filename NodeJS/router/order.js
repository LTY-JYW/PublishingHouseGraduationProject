const express = require('express')
const router = express.Router()

//获取路由逻辑模块
const order = require('../router_handler/order')
//导入验证模块中间件
const  expressJoi = require('@escook/express-joi')
//导入验证模块
const { id_query } = require('../schema/id')
const { order_add_schema,order_sel_schema } = require('../schema/order')

//添加订单模块————post请求
router.post('',expressJoi(order_add_schema),order.orderAdd)
//删除订单模块————post请求
router.delete('',expressJoi(id_query),order.orderDel)
//发货模块————post请求
router.put('',expressJoi(id_query),order.orderUp)
//查询订单模块————post请求
router.get('',expressJoi(order_sel_schema),order.orderSel)
router.get('/info',expressJoi(id_query),order.orderSelInfo)


//导出路由模块
module.exports = router