const nodemailer = require('nodemailer');
const ejs = require('ejs');
const fs = require('fs');
//导入数据库模块
const db = require('../db/index')
// 导入时间处理函数
const { timeDate } = require('../utils/Time')

class Email {
  // 构造函数
  constructor(recipient, verificationCode) {
    // 发送配置文件
    this.transporter = nodemailer.createTransport({
      host: 'smtp.163.com',
      port: 465,
      secure: true,
      auth: {
        user: 'l3437420136@163.com',
        pass: 'JEhZDNrdnNMQekyN'
      }
    });
    // 发送人
    this.recipient = recipient;
    // 验证码
    this.verificationCode = verificationCode;
    // 发送邮件
    this.emailTemplate = fs.readFileSync('assets/email.html', 'utf-8');
    // 返回值
    this.resul = {}
  }

  // 发送函数
  sendVerificationEmail() {
    return new Promise((resolve, reject) => {
      const data = {
        verificationCode: this.verificationCode
      };
      const html = ejs.render(this.emailTemplate, data);
      const mailOptions = {
        from: '"锦依卫" <l3437420136@163.com>',
        to: this.recipient,
        subject: '天翼图书验证邮件',
        text: '忘记密码?',
        html: html
      };
      // 发送邮件
      this.transporter.sendMail(mailOptions, async (error, info) => {
        if (error) {
          reject({
            message: error,
            code: 1
          });
        }
        const time = new Date()
        // 加上5分钟
        time.setMinutes(time.getMinutes() + 5);
        const sqlAdd = 'INSERT INTO verification_code (verificationCode,time) VALUES (:verificationCode,:time)'
        try {
        const resAdd = await db.executeQuery(sqlAdd, { verificationCode: data.verificationCode, time })
        resolve({
          message: "发送成功",
          code: 0
        })
      } catch (dbError) {
        reject({
          message: dbError,
          code: 2
        });
      }
    })
  })
}
  // 校验验证码过期函数
  async isCodeExpired(verificationCode) {
  const sqlSel = 'SELECT * FROM verification_code WHERE verificationCode = :verificationCode';
  try {
    const resSel = await db.executeQuery(sqlSel, { verificationCode });
    if (resSel.data.length < 1) {
      return {
        code: 1,
        message: '未找到该验证码'
      };
    }
    if (new Date(resSel.data[0].time) < new Date()) {
      const sqlDel = 'DELETE FROM verification_code WHERE verificationCode = :verificationCode';
      await db.executeQuery(sqlDel, { verificationCode });
      return {
        code: 2,
        message: '验证码过期'
      };
    }
    return {
      code: 0,
      message: '验证码正常'
    }
  } catch (dbError) {
    return {
      code: 3,
      message: dbError.message
    };
  }
}
}

module.exports = Email;