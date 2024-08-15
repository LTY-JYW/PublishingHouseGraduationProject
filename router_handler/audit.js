// 路由处理模块
//导入数据库模块
const db = require('../db/index')
//导入加密模块
const bcryptjs = require('bcryptjs')
//导入生成Token的模块
const jwt = require('jsonwebtoken')
//导入全局配置文件（主页用于生成token）
const config = require('../config')
//导入同意错误返回信息
const { isNoRes } = require('../utils/resNo')

//审核员注册处理模块
exports.reguser = async (req, res) => {
    const userInfo = req.body
    const sqlStr = 'select * from audit where username = :username'
    const result = await db.executeQuery(sqlStr, { username: userInfo.username })
    isNoRes(result)
    if (result.data.length > 0)
        return res.result('用户名被占用')
    //加密密码
    userInfo.password = bcryptjs.hashSync(userInfo.password, 10)
    // 注册
    //生成随机唯一的标识作为昵称
    const { v1 } = require('uuid')
    const nickname = '审核员' + v1()
    const regSql = 'INSERT INTO audit SET username = :username,password = :password,nickname = :nickname'
    const resultReg = await db.executeQuery(regSql, { username: userInfo.username, password: userInfo.password, nickname: nickname })
    isNoRes(resultReg)
    res.result('注册成功', 0, resultReg.data)
}

//审核员登录处理模块
exports.login = async (req, res) => {
    const formData = req.body
    const sqlSelectUserInfo = 'select * from audit where username = :username'
    const resultUserInfo = await db.executeQuery(sqlSelectUserInfo, { username: formData.username })
    isNoRes(resultUserInfo)
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

//同意驳回成为作者函数
const isAuthorUser = async (id, isStatus,res) => {
    const sqlSel = 'select * from users where id = :id and isAuthor = 2'
    const resSel = await db.executeQuery(sqlSel, { id: id })
    isNoRes(resSel)
    if (resSel.data.length !== 1) {
        return res.result('该账户未申请作者')
    }
    const sql = 'UPDATE users SET isAuthor = :isAuthor WHERE id = :id'
    const resAuthor = await db.executeQuery(sql, { id: id, isAuthor: isStatus })
    isNoRes(resAuthor)

    if (isStatus === 1) {
        return res.result('审核成功！', 0)
    }
    if( isStatus === 0){
        return res.result('驳回成功！',0)
    }

}
//同意成为作者
exports.agreeOk = (req, res) => {
    const uid = req.body.id
    isAuthorUser(uid,1,res)
}
//驳回成为作者
exports.agreeNo = (req, res) => {
    const uid = req.body.id
    isAuthorUser(uid,0,res)
}

//解禁与封禁图书
const isAuthorBooks = async (id, isStatus,res) => {
    const sqlSel = 'select * from books where id = :id and disable = 2'
    const resSel = await db.executeQuery(sqlSel, { id: id })
    isNoRes(resSel)
    if (resSel.data.length !== 1) {
        return res.result('未找到该图书审核信息')
    }
    const sql = 'UPDATE books SET disable = :disable WHERE id = :id'
    const resAuthor = await db.executeQuery(sql, { id: id, disable: isStatus })
    isNoRes(resAuthor)

    if (isStatus === 1) {
        return res.result('图书审核失败', 0)
    }
    if( isStatus === 0){
        return res.result('图书审核成功',0)
    }

}

//图书审核通过
exports.bookOk = (req, res) => {isAuthorBooks(req.body.id,0,res)}
//图书审核失败
exports.bookNo = (req, res) => {isAuthorBooks(req.body.id,1,res)}