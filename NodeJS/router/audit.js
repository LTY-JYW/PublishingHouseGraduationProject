const express = require('express')
// 创建路由实例
const router = express.Router()
//导入路由处理模块
const audit = require('../router_handler/audit')
//导入验证模块中间件
const  expressJoi = require('@escook/express-joi')
// 导入验证模块
const { overyAudit,update_auditpwd_schema } = require('../schema/audit')
const { update_nickname_schema } = require('../schema/user')
//导入验证模块
const { id,updata_Pic_schema,id_query } = require('../schema/id')
//审核员同意作者模块————post请求
router.post('/isOkAuthor',expressJoi(id),audit.agreeOk)
//审核员驳回作者模块————post请求
router.post('/isNoAuthor',expressJoi(id),audit.agreeNo)
//图书审核通过模块
router.post('/isOkBook',expressJoi(id),audit.bookOk)
//图书审核失败模块
router.post('/isNoBook',expressJoi(id),audit.bookNo)
//资讯审核通过模块
router.post('/isOkinformation',expressJoi(id),audit.informationOk)
//资讯审核失败模块
router.post('/isNoinformation',expressJoi(id),audit.informationNo)
// 获取审核员模块————get请求
router.get('/getInfo',audit.getAuditInfoService)
// 管理员获取审核员详细信息模块————get请求
router.get('/getinfoadmin',expressJoi(id_query),audit.getAuditInfoAdminService)
// 获取审核员列表————get请求
router.get('/overy',expressJoi(overyAudit),audit.selOveryAudit)
// 更新审核员密码————post请求
router.put('/pwd',expressJoi(update_auditpwd_schema),audit.updataAuditPWDService)
// 更新审核员头像————post请求
router.put('/avatar',expressJoi(updata_Pic_schema),audit.updateAuditPicService)
// 更新审核员详细信息————post请求
router.put('/info',expressJoi(update_nickname_schema),audit.updateAuditInfoService)



//导出路由
module.exports = router