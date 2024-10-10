// 路由处理模块
//导入数据库模块
const db = require('../db/index')
//导入加密模块
const bcryptjs = require('bcryptjs')
//导入生成Token的模块
const jwt = require('jsonwebtoken')
//导入全局配置文件（主页用于生成token）
const config = require('../config')


//用户注册处理模块
exports.reguser = async (req, res) => {
    const userInfo = req.body
    const sqlStr = 'select * from users where username = :username'
    const result = await db.executeQuery(sqlStr, { username: userInfo.username })
    if (result.data.length > 0)
        return res.result('用户名被占用')
    //加密密码
    userInfo.password = bcryptjs.hashSync(userInfo.password, 10)
    // 注册
    //生成随机唯一的标识作为昵称
    const { v1 } = require('uuid')
    const nickname = '用户'+v1()
    const regSql = 'INSERT INTO users SET username = :username,password = :password,nickname = :nickname'
    const resultReg = await db.executeQuery(regSql, { username: userInfo.username, password: userInfo.password, nickname:nickname })
    res.result('注册成功',0,resultReg.data)
}

//用户登录处理模块
exports.login = async (req, res) => {
    const formData = req.body
    const sqlSelectUserInfo = 'select * from users where username = :username'
    const resultUserInfo = await db.executeQuery(sqlSelectUserInfo,{username:formData.username})
    if(resultUserInfo.data.length !== 1)
        return res.result('没有该用户！')
    if(! await bcryptjs.compare(formData.password,resultUserInfo.data[0].password))
        return res.result('密码错误！')

    //创建没有用户密码和头像的用户对象用于生成token
    const userToken = {
        ...resultUserInfo.data[0],
        password:null,
        user_pic:null,
        permissions:2
    }
    //调用插件生成token
    //20个小时token过期
    const token = jwt.sign(userToken,config.jwtSecretKey,{
        algorithm: "HS256",
        expiresIn:'20h'
    })
    res.result('登陆成功！',0,{token: 'Bearer ' + token})
}