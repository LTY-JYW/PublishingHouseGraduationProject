// 路由处理模块
//导入数据库模块
const db = require('../db/index')
//导入加密模块
const bcryptjs = require('bcryptjs')
//导入生成Token的模块
const jwt = require('jsonwebtoken')
//导入全局配置文件（主页用于生成token）
const config = require('../config')

//添加管理员处理模块
exports.reguser = async (req, res) => {
    const userInfo = req.body
    const sqlStr = 'select * from admin where username = :username'
    const result = await db.executeQuery(sqlStr, { username: userInfo.username })
    if (result.status !== 0) {
        return res.result(result.message)
    }
    if (result.status !== 0)
        return res.result(result.message)
    if (result.data.length > 0)
        return res.result('用户名被占用')
    //加密密码
    userInfo.password = bcryptjs.hashSync(userInfo.password, 10)
    // 注册
    //生成随机唯一的标识作为昵称
    const { v1 } = require('uuid')
    const nickname = '管理员' + v1()
    const regSql = 'INSERT INTO admin SET username = :username,password = :password,nickname = :nickname'
    const resultReg = await db.executeQuery(regSql, { username: userInfo.username, password: userInfo.password, nickname: nickname })
    if (resultReg.status !== 0)
        return res.result(resultReg.message)
    res.result('注册成功', 0, resultReg.data)
}

//管理员登录处理模块
exports.login = async (req, res) => {
    const formData = req.body
    const sqlSelectUserInfo = 'select * from admin where username = :username'
    const resultUserInfo = await db.executeQuery(sqlSelectUserInfo, { username: formData.username })
    if (resultUserInfo.status !== 0) {
        return res.result(resultUserInfo.message)
    }
    if (resultUserInfo.data.length !== 1)
        return res.result('没有该用户！')
    if (! await bcryptjs.compare(formData.password, resultUserInfo.data[0].password))
        return res.result('密码错误！')

    //创建没有用户密码和头像的用户对象用于生成token
    const userToken = {
        ...resultUserInfo.data[0],
        password: null,
        user_pic: null
    }
    //调用插件生成token
    //20个小时token过期
    const token = jwt.sign(userToken, config.jwtSecretKey, {
        algorithm: "HS256",
        expiresIn: '20h'
    })

    res.send({
        status: 0,
        message: '登录成功',
        token: 'Bearer ' + token
    })
}

//禁用用户处理模块
exports.disable = async (req, res) => {
    const uid = req.body.id
    const sqlSelect = 'select * from users where id = :id and disable = 0'
    const resSelect = await db.executeQuery(sqlSelect, { id: uid })
    if (resSelect.status !== 0) {
        return res.result(resSelect.message)
    }
    if (resSelect.data.length != 1) {
        return res.result('该用户已是封禁状态！')
    }
    const sql = 'UPDATE users SET disable = 1 WHERE id = :id'
    const resultReg = await db.executeQuery(sql, { id: uid })
    if (resultReg.status !== 0)
        return res.result(resultReg.message)
    res.result('封禁成功！', 0)

}

//启用用户处理模块
exports.enable = async (req, res) => {
    const uid = req.body.id
    const sqlSelect = 'select * from users where id = :id and disable = 1'
    const resSelect = await db.executeQuery(sqlSelect, { id: uid })
    if (resSelect.status !== 0)
        return res.result(resSelect.message)
    if (resSelect.data.length != 1) {
        return res.result('该用户已是正常状态！')
    }
    const sql = 'UPDATE users SET disable = 0 WHERE id = :id'
    const resultReg = await db.executeQuery(sql, { id: uid })
    if (resultReg.status !== 0)
        return res.result(resultReg.message)
    res.result('启用成功！', 0)

}

