const express = require('express')
const router = express.Router()

//获取路由逻辑模块
const address = require('../router_handler/address')
//导入验证模块中间件
const  expressJoi = require('@escook/express-joi')
//导入验证模块
const { id } = require('../schema/id')
const { address_add_schema,address_up_schema,address_sel_schema } = require('../schema/address')

//添加地址模块————post请求
router.post('',expressJoi(address_add_schema),address.addressAdd)
// 删除地址模块————delete请求
router.delete('',expressJoi(id),address.addressDel)
// 更新地址模块————put请求
router.put('',expressJoi(address_up_schema),address.addressUp)
// 查询地址模块————get请求
router.get('',expressJoi(address_sel_schema),address.addressSel)
// 设置默认地址模块————put请求
router.put('/def',expressJoi(id),address.addressDef)

//导出路由模块
module.exports = router