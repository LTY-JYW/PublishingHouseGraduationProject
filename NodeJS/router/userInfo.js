const express = require('express')
const router = express.Router()

//导入验证模块所需要的中间件
const  expressJoi = require('@escook/express-joi')
//导入创建好的验证模块
const { updata_userInfo_schema,update_userpwd_schema,updata_userPic_schema,overy_sel_schema,updateUserPicService_schema } = require('../schema/user')
const { id_query } = require('../schema/id')

//获取路由逻辑模块
const userInfo = require('../router_handler/userInfo')
//配置获取用户信息接口————get请求
router.get('/userinfo',userInfo.getUserInfoService)
//配置更新用户信息接口————post请求
router.put('/userinfo',expressJoi(updata_userInfo_schema),userInfo.updataUserInfoService)
//配置更新用户密码接口————post请求
router.put('/pwd',expressJoi(update_userpwd_schema),userInfo.updataUserPWDService)
// 忘记密码接口————post请求
router.put('',expressJoi(updateUserPicService_schema),userInfo.forgetThePassword)
//配置更新用户头像接口————post请求
router.put('/avatar',expressJoi(updata_userPic_schema),userInfo.updateUserPicService)
// 配置申请成为作者接口————post请求
router.post('/author',userInfo.addAuthor)
// 配置获取用户列表接口————get请求
router.get('/overy',expressJoi(overy_sel_schema),userInfo.overySel)

//导出路由模块
module.exports = router