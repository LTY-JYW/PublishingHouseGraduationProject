//导入验证模块
const joi = require('joi')
const username = joi.string().min(1).max(10).alphanum().required()
const password = joi.string().pattern(/^[\S]{6,12}$/).required()
const id = joi.number().integer().min(1).required()
const nickname = joi.string().required()
const phoneNumber = joi.string().pattern(/^1[3-9]\d{9}$/).required();
const email = joi.string().email().required()
const briefly = joi.string().required()
const avatar = joi.string().required()
const page = joi.number().min(1).required()
const itemsPerPage = joi.number().min(1).required()

//登录注册验证规则
exports.reg_login_schema = {
    body: {
        username,
        password
    }
}
//更新用户信息验证规则
exports.updata_userInfo_schema = {
    body: {
        nickname,
        email,
        briefly,
        avatar,
        phoneNumber
        
    }
}
//更新用户密码验证规则
exports.update_userpwd_schema = {
    body:{
        oldPwd:password,
        newPwd:joi.not(joi.ref('oldPwd')).concat(password)
    }
}
//更新用户头像验证规则
exports.updata_userPic_schema = {
    body:{
        avatar
    }
}
// 更新昵称验证规则
exports.update_nickname_schema = {
    body:{
        nickname
    }
}

// 获取所用用户验证规则
exports.overy_sel_schema = {
    query:{
        page,
        itemsPerPage
    }
}

