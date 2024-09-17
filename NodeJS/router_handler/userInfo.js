const db = require('../db/index')
//导入解密模块
const bcryptjs = require('bcryptjs')
//导入同意错误返回信息
const { isNoRes } = require('../utils/resNo')

//获取用户基本信息模块
exports.getUserInfo = async (req, res,id) => {
    const sqlGetUserInfo = 'select id,username,nickname,email,avatar,disable,isAuthor from users where id = :id'
    const resultsUserInfo = await db.executeQuery(sqlGetUserInfo, { id })
    isNoRes(resultsUserInfo)
    if (resultsUserInfo.status !== 0)
        return res.result(resultsUserInfo.message)
    return res.result('信息获取成功', 0, resultsUserInfo.data)
}

//获取用户基本信息
exports.getUserInfoService = async (req, res) => {
    return this.getUserInfo(req,res,req.auth.id)
}

// 管理员获取用户信息
exports.getUserInfoAdminService = async (req, res) => {
    return this.getUserInfo(req,res,req.query.id)
}

//更新用户信息
exports.updataUserInfoService = async (req, res) => {
    const sql = 'UPDATE users SET nickname = :nickname,email = :email,briefly = :briefly WHERE id = :id'
    const results = await db.executeQuery(sql, { nickname: req.body.nickname, email: req.body.email, id: req.auth.id, briefly: req.body.briefly })
    isNoRes(results)
    return res.result('更新成功！', 0)
}
//更新用户密码
exports.updataUserPWDService = async (req, res) => {
    //看该用户是否存在
    const sqlSelect = 'select * from users where id = :id'
    const results = await db.executeQuery(sqlSelect, { id: req.auth.id })
    isNoRes(results)
    if (results.data.length !== 1) {
        res.result('用户不存在！')
    }
    if (! await bcryptjs.compare(req.body.oldPwd, results.data[0].password)) {
        res.result('原密码错误！')
    }
    const sqlUpdate = 'UPDATE users SET password = :password WHERE id = :id'
    const newpassword = bcryptjs.hashSync(req.body.newPwd, 10)
    const resultUp = await db.executeQuery(sqlUpdate, { password: newpassword, id: req.auth.id })
    isNoRes(resultUp)
    return res.result('密码更新成功', 0)
}
//更新用户头像
exports.updateUserPicService = async (req, res) => {
    const sql = 'UPDATE users SET avatar = :avatar WHERE id = :id'
    const results = await db.executeQuery(sql, { avatar: req.body.avatar, id: req.auth.id })
    isNoRes(results)
    return res.result('头像更新成功！', 0)
}
//申请作者
exports.addAuthor = async (req, res) => {
    const data = req.body
    const sql = 'UPDATE users SET isAuthor = 2 WHERE id = :id'
    const resultReg = await db.executeQuery(sql, { id: data.id })
    isNoRes(resultReg)
    return res.result('申请作者成功!', 0)
}

// 获取用户列表
exports.overySel = async (req, res) => {
    const formDate = req.query
    // page 是当前页码。
    // itemsPerPage 是每页显示的项目数量
    // 计算 offset(从哪一行开始返回数据)
    const offset = (formDate.page - 1) * formDate.itemsPerPage;
    //LIMIT 用于限制查询结果的行数。
    //OFFSET 用于指定从哪一行开始返回数据。
    const sql = `SELECT id,username,nickname,avatar,email,briefly,disable,isAuthor,aid FROM users LIMIT ${formDate.itemsPerPage} OFFSET ${offset}`
    const resSel = await db.executeQuery(sql);
    if (resSel.data.length < 1) {
        return res.result('暂无审核员员信息')
    }
    isNoRes(resSel)

    // 查询获取数据总数 
    const sqlCount = 'SELECT COUNT(*) AS count FROM users'
    const resCount = await db.executeQuery(sqlCount)
    isNoRes(resCount)
    const count = resCount.data[0].count

    // 返回结果
    return res.result('获取成功！', 0,{
        value: resSel.data,
        count
    })
}