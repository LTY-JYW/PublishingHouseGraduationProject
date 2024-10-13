// 路由处理模块
//导入数据库模块
const db = require('../db/index')
const Email = require('../utils/email')

//发送验证码处理模块
exports.email = async (req, res) => {
    const { recipient } = req.query
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let verificationCode = '';
    const charactersLength = characters.length;
    for (let i = 0; i < 6; i++) {
        verificationCode += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    const sqlSel = 'select verificationCode from verification_code'
    const resSel = await db.executeQuery(sqlSel)
    console.log(resSel.data[0].verificationCode);
    for (; resSel.data[0].verificationCode === verificationCode;) {
        for (let i = 0; i < 6; i++) {
            verificationCode += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
    }
    const email = new Email(recipient, verificationCode);
    const data = await email.sendVerificationEmail()
    res.result(data.message, data.code, {verificationCode})
}