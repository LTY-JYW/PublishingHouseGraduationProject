const express = require('express')
const router = express.Router()

//导入验证模块所需要的中间件
const  expressJoi = require('@escook/express-joi')
//导入创建好的验证模块
const { updata_userInfo_schema,update_userpwd_schema,updata_userPic_schema } = require('../schema/user')

//获取路由逻辑模块
const userInfo = require('../router_handler/userInfo')
//配置获取用户信息接口
router.get('/userinfo',userInfo.getUserInfoService)
//配置更新用户信息接口
router.post('/userinfo',expressJoi(updata_userInfo_schema),userInfo.updataUserInfoService)
//配置更新用户密码接口
router.post('/updatepwd',expressJoi(update_userpwd_schema),userInfo.updataUserPWDService)
//配置更新用户头像接口
router.post('/update/avatar',expressJoi(updata_userPic_schema),userInfo.updateUserPicService)

//导出路由模块
module.exports = router