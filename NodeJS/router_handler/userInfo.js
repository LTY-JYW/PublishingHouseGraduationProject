const db = require('../db/index')
//导入解密模块
const bcryptjs = require('bcryptjs')
// 导入公共函数
const { isUser } = require('../utils/funtion')
const Email = require('../utils/email')
//获取用户基本信息模块
exports.getUserInfo = async (req, res, id) => {
    const sqlGetUserInfo = 'select id,flyer,username,nickname,avatar,phoneNumber,email,briefly,disable,isAuthor,aid from users where id = :id'
    const resultsUserInfo = await db.executeQuery(sqlGetUserInfo, { id })
    return res.result('信息获取成功', 0, resultsUserInfo.data)
}
//获取用户基本信息
exports.getUserInfoService = async (req, res) => {
        if(isUser(req,res)){
        return res.result('该接口限用户调用')
    }
    return this.getUserInfo(req, res, req.auth.id)
}

// 管理员获取用户信息
exports.getUserInfoAdminService = async (req, res) => {
    const { id } = req.query
    const sqlSel = 'select id,username,flyer,nickname,avatar,phoneNumber,email,briefly,disable,isAuthor,aid from users where id = :id'
    const resSel = await db.executeQuery(sqlSel,{id})
    if(resSel.data.length != 1){
        return res.result('没有这个用户！')
    }
    return res.result('用户信息获取成功！',0,resSel.data)
}

//更新用户信息
exports.updataUserInfoService = async (req, res) => {
    const { nickname, email, briefly, avatar, phoneNumber, } = req.body
    const id = req.auth.id
    //看该用户是否存在
    const sqlSelect = 'select * from users where id = :id'
    const resSelect = await db.executeQuery(sqlSelect, { id })
    if (resSelect.data.length !== 1) {
        res.result('用户不存在！')
    }
    const sql = 'UPDATE users SET nickname = :nickname,email = :email,briefly = :briefly,avatar = :avatar,phoneNumber = :phoneNumber WHERE id = :id'
    const results = await db.executeQuery(sql, { nickname, email, briefly, avatar, id, phoneNumber })
    return res.result('更新成功！', 0)
}
//忘记密码
exports.updataUserPWDService = async (req, res) => {
        if(isUser(req,res)){
        return res.result('该接口限用户调用')
    }
    // const email = new Email();
    // const {newPwd,oldPwd,verificationCode} = req.body
    // const a =  await email.isCodeExpired(verificationCode)
    // if(a.code != 0){
    //     return res.result(a.message)
    // }
    //看该用户是否存在
    const sqlSelect = 'select * from users where id = :id'
    const results = await db.executeQuery(sqlSelect, { id: req.auth.id })
    if (results.data.length !== 1) {
        return res.result('用户不存在！')
    }
    if (! await bcryptjs.compare(req.body.oldPwd, results.data[0].password)) {
        return res.result('原密码错误！')
    }
    const sqlUpdate = 'UPDATE users SET password = :password WHERE id = :id'
    const newpassword = bcryptjs.hashSync(req.body.newPwd, 10)
    const resultUp = await db.executeQuery(sqlUpdate, { password: newpassword, id: req.auth.id })
    return res.result('密码更新成功', 0)
}
//更新用户密码
exports.forgetThePassword = async (req, res) => {
    if(isUser(req,res)){
    return res.result('该接口限用户调用')
}
const email = new Email();
const {newPwd,verificationCode} = req.body
const id = req.auth.id
const a =  await email.isCodeExpired(verificationCode)
if(a.code != 0){
    return res.result(a.message)
}
//看该用户是否存在
const sqlSelect = 'select * from users where id = :id'
const results = await db.executeQuery(sqlSelect, { id })
if (results.data.length !== 1) {
    return res.result('用户不存在！')
}

const sqlUpdate = 'UPDATE users SET password = :password WHERE id = :id'
const newpassword = bcryptjs.hashSync(newPwd, 10)
const resultUp = await db.executeQuery(sqlUpdate, { password: newpassword, id })
return res.result('密码更新成功', 0)
}


//更新用户头像
exports.updateUserPicService = async (req, res) => {
        if(isUser(req,res)){
        return res.result('该接口限用户调用')
    }
    const { avatar } = req.body
    const { id } = req.auth
    //看该用户是否存在
    const sqlSelect = 'select * from users where id = :id'
    const resSelect = await db.executeQuery(sqlSelect, { id })
    if (resSelect.data.length !== 1) {
        res.result('用户不存在！')
    }
    const sql = 'UPDATE users SET avatar = :avatar WHERE id = :id'
    const results = await db.executeQuery(sql, { avatar, id })
    return res.result('头像更新成功！', 0)
}
//申请作者
exports.addAuthor = async (req, res) => {
    const { id } = req.auth
    const { reviewMaterials } = req.body
        if(isUser(req,res)){
        return res.result('该接口限用户调用')
    }
    //看该用户是否存在
    const sqlSelect = 'select * from users where id = :id'
    const resSelect = await db.executeQuery(sqlSelect, { id })
    if (resSelect.data.length !== 1) {
        return res.result('用户不存在！')
    }
    const sqlAuthorOne = 'select * from users where id = :id and isAuthor = 1'
    const resAuthorOne = await db.executeQuery(sqlAuthorOne, { id })
    if (resAuthorOne.data.length >= 1) {
        return res.result('该用户已经是作者！')
    }
    const sqlAuthorTwo = 'select * from users where id = :id and isAuthor = 2'
    const resAuthorTwo = await db.executeQuery(sqlAuthorTwo, { id })
    if (resAuthorTwo.data.length >= 1) {
        return res.result('已申请！请耐心等待')
    }

    const sql = 'UPDATE users SET isAuthor = 2,reviewMaterials = :reviewMaterials WHERE id = :id'
    const resultReg = await db.executeQuery(sql, { id,reviewMaterials })
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
    const sql = `SELECT 
                    users.id,
                    users.username,
                    users.nickname,
                    users.avatar,
                    users.phoneNumber,
                    users.email,
                    users.briefly,
                    users.disable,
                    users.isAuthor,
                    users.aid,
                    users.flyer,
                    users.time,
                    users.reviewMaterials,
		            audit.nickname AS aValue,
                    SUM(books.popularity) as heat
                    FROM 
                        users
                    LEFT JOIN 
                        audit ON users.aid = audit.id
                    LEFT JOIN 
                        books ON users.id = books.uid
                    GROUP BY 
                        users.id
		            LIMIT ${formDate.itemsPerPage} OFFSET ${offset}`
    const resSel = await db.executeQuery(sql);
    // 查询获取数据总数 
    const sqlCount = 'SELECT COUNT(*) AS count FROM users'
    const resCount = await db.executeQuery(sqlCount)
    const count = resCount.data[0].count

    // 返回结果
    return res.result('获取成功！', 0, {
        value: resSel.data,
        count
    })
}
// 获取用户列表
exports.overySelNoPage = async (req, res) => {
    const sql = `SELECT 
    users.id,
    users.username,
    users.nickname,
    users.avatar,
    users.phoneNumber,
    users.email,
    users.briefly,
    users.disable,
    users.isAuthor,
    users.aid,
    users.flyer, 
    users.time,
    users.reviewMaterials,
    SUM(books.popularity) as heat,
    audit.nickname AS aValue
FROM 
    users
LEFT JOIN 
    audit ON users.aid = audit.id
JOIN 
    books ON users.id = books.uid
WHERE 
    users.disable = 0 AND users.isAuthor = 1
GROUP BY 
    users.id
ORDER BY 
    heat DESC;
`
    const resSel = await db.executeQuery(sql);
    // 查询获取数据总数 
    const sqlCount = 'SELECT COUNT(*) AS count FROM users'
    const resCount = await db.executeQuery(sqlCount)
    const count = resCount.data[0].count
    resSel.data.forEach(item => {
        item.flyer = item.flyer.replace(/\t/g, '');
    });
    // 返回结果
    return res.result('获取成功！', 0, {
        value: resSel.data,
        count
    })
}