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
    res.result('注册成功', 0)
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
const isAuthorUser = async (req, isStatus, res) => {
    const id = req.body.id
    const sqlSel = 'select * from users where id = :id and isAuthor = 2'
    const resSel = await db.executeQuery(sqlSel, { id: id })
    isNoRes(resSel)
    if (resSel.data.length !== 1) {
        return res.result('该账户未申请作者')
    }
    const sql = 'UPDATE users SET isAuthor = :isAuthor,aid = :aid WHERE id = :id'
    const resAuthor = await db.executeQuery(sql, { id: id, isAuthor: isStatus, aid: req.auth.id })
    isNoRes(resAuthor)

    if (isStatus === 1) {
        return res.result('审核成功！', 0)
    }
    if (isStatus === 0) {
        return res.result('驳回成功！', 0)
    }

}
//同意成为作者
exports.agreeOk = (req, res) => {
    isAuthorUser(req, 1, res)
}
//驳回成为作者
exports.agreeNo = (req, res) => {
    isAuthorUser(req, 0, res)
}

//解禁与封禁图书
const isAuthorBooks = async (req, isStatus, res) => {
    const id = req.body.id
    const sqlSel = 'select * from books where id = :id and disable = 2'
    const resSel = await db.executeQuery(sqlSel, { id: id })
    isNoRes(resSel)
    if (resSel.data.length !== 1) {
        return res.result('未找到该图书审核信息')
    }
    const sql = 'UPDATE books SET disable = :disable,aid = :aid WHERE id = :id'
    const resAuthor = await db.executeQuery(sql, { id: id, disable: isStatus, aid: req.auth.id })
    isNoRes(resAuthor)

    return res.result('审核成功！', 0)

}

// 获取管理员信息处理函数
exports.getAuditInfo = async (req, res,id) => {
    const sqlGetAuditInfo = 'select id,username,nickname,avatar from audit where id = :id'
    const resultsAuditInfo = await db.executeQuery(sqlGetAuditInfo, { id })
    isNoRes(resultsAuditInfo)
    if (resultsAuditInfo.status !== 0)
        return res.result(resultsAuditInfo.message)
    return res.result('信息获取成功', 0, resultsAuditInfo.data)
}
//审核员获取自身信息处理模块
exports.getAuditInfoService = async (req, res) => {
    return this.getAuditInfo(req,res,req.auth.id)
}
// 管理员获取审核员信息处理模块
exports.getAuditInfoAdminService = async (req, res) => {
    return this.getAuditInfo(req,res,req.query.id)
}

//图书审核通过
exports.bookOk = (req, res) => { isAuthorBooks(req, 0, res) }
//图书审核失败
exports.bookNo = (req, res) => { isAuthorBooks(req, 1, res) }

// 获取审核员列表
exports.selOveryAudit = async (req, res) => {
    const formDate = req.query
    // page 是当前页码。
    // itemsPerPage 是每页显示的项目数量
    // 计算 offset(从哪一行开始返回数据)
    const offset = (formDate.page - 1) * formDate.itemsPerPage;
    //LIMIT 用于限制查询结果的行数。
    //OFFSET 用于指定从哪一行开始返回数据。
    const sql = `SELECT id,username,nickname,avatar FROM audit LIMIT ${formDate.itemsPerPage} OFFSET ${offset}`
    const resSel = await db.executeQuery(sql);
    if (resSel.data.length < 1) {
        return res.result('暂无审核员员信息')
    }
    isNoRes(resSel)

    // 查询获取数据总数 
    const sqlCount = 'SELECT COUNT(*) AS count FROM audit'
    const resCount = await db.executeQuery(sqlCount)
    isNoRes(resCount)
    const count = resCount.data[0].count

    // 返回结果
    return res.result('获取成功！', 0,{
        value: resSel.data,
        count
    })
}

// 更新审核员信息
exports.updataUserInfoService = async (req, res) => {
    const sql = 'UPDATE audit SET nickname = :nickname WHERE id = :id'
    const results = await db.executeQuery(sql, { nickname: req.body.nickname, id: req.auth.id})
    isNoRes(results)
    return res.result('更新成功！', 0)
}

// 更新审核员密码
exports.updataAuditPWDService = async (req, res) => {
    //看该用户是否存在
    const sqlSelect = 'select * from audit where id = :id'
    const results = await db.executeQuery(sqlSelect, { id: req.auth.id })
    isNoRes(results)
    if (results.data.length !== 1) {
        res.result('用户不存在！')
        return
    }
    if (! await bcryptjs.compare(req.body.oldPwd, results.data[0].password)) {
        res.result('原密码错误！')
        return
    }
    const sqlUpdate = 'UPDATE audit SET password = :password WHERE id = :id'
    const newpassword = bcryptjs.hashSync(req.body.newPwd, 10)
    const resultUp = await db.executeQuery(sqlUpdate, { password: newpassword, id: req.auth.id })
    isNoRes(resultUp)
    return res.result('密码更新成功', 0)
}

//更新审核员头像
exports.updateAuditPicService = async (req, res) => {
    const sql = 'UPDATE audit SET avatar = :avatar WHERE id = :id'
    const results = await db.executeQuery(sql, { avatar: req.body.avatar, id: req.auth.id })
    isNoRes(results)
    return res.result('头像更新成功！', 0)
}