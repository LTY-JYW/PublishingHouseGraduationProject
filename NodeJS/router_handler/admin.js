// 路由处理模块
//导入数据库模块
const db = require('../db/index')
//导入加密模块
const bcryptjs = require('bcryptjs')
//导入生成Token的模块
const jwt = require('jsonwebtoken')
//导入全局配置文件（主页用于生成token）
const config = require('../config')
//导入公共函数
const { isAdmin } = require('../utils/funtion')

//添加管理员处理模块
exports.reguser = async (req, res) => {
    const userInfo = req.body
    const sqlStr = 'select * from admin where username = :username'
    const results = await db.executeQuery(sqlStr, { username: userInfo.username })
    if (results.data.length > 0)
        return res.result('用户名被占用')
    //加密密码
    userInfo.password = bcryptjs.hashSync(userInfo.password, 10)
    // 注册
    //生成随机唯一的标识作为昵称
    const { v1 } = require('uuid')
    const nickname = '管理员' + v1()
    const regSql = 'INSERT INTO admin SET username = :username,password = :password,nickname = :nickname'
    const resultReg = await db.executeQuery(regSql, { username: userInfo.username, password: userInfo.password, nickname: nickname })
    return res.result('注册成功', 0, resultReg.data)
}

//管理员登录处理模块
exports.login = async (req, res) => {
    const formData = req.body
    const sqlSelectUserInfo = 'select * from admin where username = :username'
    const resultUserInfo = await db.executeQuery(sqlSelectUserInfo, { username: formData.username })
    if (resultUserInfo.data.length !== 1)
        return res.result('没有该用户！')
    if (! await bcryptjs.compare(formData.password, resultUserInfo.data[0].password))
        return res.result('密码错误！')

    //创建没有用户密码和头像的用户对象用于生成token
    const userToken = {
        ...resultUserInfo.data[0],
        password: null,
        user_pic: null,
        permissions: 0
    }
    //调用插件生成token
    //20个小时token过期
    const token = jwt.sign(userToken, config.jwtSecretKey, {
        algorithm: "HS256",
        expiresIn: '20h'
    })
    return res.result('登陆成功！', 0, { token: 'Bearer ' + token })
}

//禁用用户处理模块
exports.disable = async (req, res) => {
    const uid = req.body.id
    const sqlSelect = 'select * from users where id = :id and disable = 0'
    const resSelect = await db.executeQuery(sqlSelect, { id: uid })
    if (resSelect.data.length != 1) {
        return res.result('该用户已是封禁状态！')
    }
    const sql = 'UPDATE users SET disable = 1 WHERE id = :id'
    const resultReg = await db.executeQuery(sql, { id: uid })
    return res.result('封禁成功！', 0)

}

//启用用户处理模块
exports.enable = async (req, res) => {
    const uid = req.body.id
    const sqlSelect = 'select * from users where id = :id and disable = 1'
    const resSelect = await db.executeQuery(sqlSelect, { id: uid })
    if (resSelect.data.length != 1) {
        return res.result('该用户已是正常状态！')
    }
    const sql = 'UPDATE users SET disable = 0 WHERE id = :id'
    const resultReg = await db.executeQuery(sql, { id: uid })
    return res.result('启用成功！', 0)

}

//获取管理员信息处理模块
exports.getAdminInfoService = async (req, res) => {
    if (isAdmin(req, res)) {
        return res.result('该接口限管理员调用')
    }
    const sqlGetAdminInfo = 'select id,username,nickname,avatar from admin where id = :id'
    const resultsAdminInfo = await db.executeQuery(sqlGetAdminInfo, { id: req.auth.id })
    return res.result('信息获取成功', 0, resultsAdminInfo.data)
}

//更新管理员头像
exports.updateAdminPicService = async (req, res) => {
    if (isAdmin(req, res)) {
        return res.result('该接口限管理员调用')
    }
    const sql = 'UPDATE admin SET avatar = :avatar WHERE id = :id'
    const results = await db.executeQuery(sql, { avatar: req.body.avatar, id: req.auth.id })
    return res.result('头像更新成功！', 0)
}

//更新管理员信息
exports.updateAdminInfoService = async (req, res) => {
    if (isAdmin(req, res)) {
        return res.result('该接口限管理员调用')
    }
    //看该用户是否存在
    const sqlSelect = 'select * from admin where id = :id'
    const resSelect = await db.executeQuery(sqlSelect, { id: req.auth.id })
    if (resSelect.data.length !== 1) {
        return res.result('管理员不存在！')
    }
    const { nickname } = req.body
    const sql = 'UPDATE admin SET nickname = :nickname WHERE id = :id'
    const results = await db.executeQuery(sql, { nickname, id: req.auth.id })
    return res.result('信息更新成功！', 0)
}



//更新管理员密码
exports.updataAdminPWDService = async (req, res) => {
    if(isAdmin(req,res)){
    return res.result('该接口限管理员调用')
}
//看该管理员是否存在
const sqlSelect = 'select * from admin where id = :id'
const results = await db.executeQuery(sqlSelect, { id: req.auth.id })
if (results.data.length !== 1) {
    return res.result('管理员不存在！')
}
if (! await bcryptjs.compare(req.body.oldPwd, results.data[0].password)) {
    return res.result('原密码错误！')
}
const sqlUpdate = 'UPDATE admin SET password = :password WHERE id = :id'
const newpassword = bcryptjs.hashSync(req.body.newPwd, 10)
const resultUp = await db.executeQuery(sqlUpdate, { password: newpassword, id: req.auth.id })
return res.result('密码更新成功', 0)
}