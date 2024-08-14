const db = require('../db/index')
//导入解密模块
const bcryptjs = require('bcryptjs')
//获取用户基本信息
exports.getUserInfoService = async (req, res) => {
    const sqlGetUserInfo = 'select id,username,nickname,email,avatar,disable,isAuthor from users where id = :id'
    const resultsUserInfo = await db.executeQuery(sqlGetUserInfo, { id: req.auth.id })
    if (resultsUserInfo.status !== 0)
        return res.result(resultsUserInfo.message)
    return res.result('信息获取成功', 0, resultsUserInfo.data)
}
//更新用户信息
exports.updataUserInfoService = async (req, res) => {
    const sql = 'UPDATE users SET nickname = :nickname,email = :email,briefly = :briefly WHERE id = :id'
    const results = await db.executeQuery(sql, { nickname: req.body.nickname, email: req.body.email, id: req.auth.id, briefly: req.body.briefly })
    if (results.status !== 0)
        return res.result(results.message)
    return res.result('更新成功！', 0)
}
//更新用户密码
exports.updataUserPWDService = async (req, res) => {
    //看该用户是否存在
    const sqlSelect = 'select * from users where id = :id'
    const results = await db.executeQuery(sqlSelect, { id: req.auth.id })
    if( results.status !== 0 ){
        return res.result(results.message)
    }
    if (results.data.length !== 1) {
        res.result('用户不存在！')
    }
    if (! await bcryptjs.compare(req.body.oldPwd, results.data[0].password)) {
        res.result('原密码错误！')
    }
    const sqlUpdate = 'UPDATE users SET password = :password WHERE id = :id'
    const newpassword = bcryptjs.hashSync(req.body.newPwd, 10)
    const resultUp = await db.executeQuery(sqlUpdate, { password: newpassword, id: req.auth.id })
    if (resultUp.status !== 0)
        return res.result(resultUp.message)
    return res.result('密码更新成功', 0)
}
//更新用户头像
exports.updateUserPicService = async (req, res) => {
    const sql = 'UPDATE users SET avatar = :avatar WHERE id = :id'
    const results = await db.executeQuery(sql, { avatar: req.body.avatar, id: req.auth.id })
    if (results.status !== 0)
        return res.result(results.message)
    return res.result('头像更新成功！', 0)
}
//申请作者
exports.addAuthor = async (req, res) => {
    const data = req.body
    const sql = 'UPDATE users SET isAuthor = 2 WHERE id = :id'
    const resultReg = await db.executeQuery(sql, { id: data.id })
    if (resultReg.status !== 0)
        return res.result(resultReg.message)
    return res.result('申请作者成功!', 0)
}