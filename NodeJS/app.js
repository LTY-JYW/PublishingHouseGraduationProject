//导入express模块————用于创建服务器
const express = require('express')
// multer模块————用于上传
const multer = require('multer');
//创建服务器实例
const app = express()
//导入cors模块————用于解决跨域问题
const cors = require('cors')
//导入验证模块
const joi = require('joi')
//导入全局解析token的中间件
const { expressjwt: jwt } = require('express-jwt')
//导入全局配置文件（主页用于解析token）
const config = require('./config.js')
//导入lodash库（用于判断对象是否相等）
const lodash = require('lodash')

const fs = require('fs');

if (!fs.existsSync('uploads')) {
    fs.mkdirSync('uploads');
}

// 创建 Multer 实例
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // 文件保存的目录
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now()); // 文件名
    }
});

const upload = multer({ storage: storage });

//注册中间件
app.use(cors())

// 配置 Multer 中间件
app.use('/api/uploads/upload', upload.single('file'), (req, res, next) => {
    if (!req.file) {
        return res.status(400).send('No files were uploaded.');
    }
    next();
});

//配置解析application/x-www-form-urlencoded的中间件
app.use(express.urlencoded({ extended: false }))
//配置解析application/json的中间件
app.use(express.json())
//统一返回值的中间件
app.use(function (req, res, next) {
    res.result = async (err, code = 1, data = {}) => {
        if (lodash.isEqual(data, {})) {
            await res.send({
                code,
                message: err instanceof Error ? err.message : err,
            })
            next()
            return
        }

        await res.send({
            code,
            message: err instanceof Error ? err.message : err,
            data
        })
    }
    next()
})
//全局解析token的中间件
app.use(jwt({
    secret: config.jwtSecretKey,
    algorithms: ["HS256"]
}).unless({
    path: [/^\/api\//]
}))
//调用路由模块
const userRouter = require('./router/user')
const userInfo = require('./router/userInfo.js')
const adminlogin = require('./router/adminlog.js')
const admin = require('./router/admin.js')
const auditLogin = require('./router/auditlog.js')
const audit = require('./router/audit.js')
const information = require('./router/information.js')
const category = require('./router/category.js')
const category2 = require('./router/category2.js')
const books = require('./router/books.js')
const cart = require('./router/cart.js')
const uploads = require('./router/uploads.js')
//api开头无需token认证
app.use('/api', userRouter)
app.use('/api', uploads)
app.use('/api/admin', adminlogin)
app.use('/api/audit', auditLogin)
app.use('/api/uploads', uploads)
//my开头需要token认证
app.use('/my', userInfo)
app.use('/my/admin', admin)
app.use('/my/audit', audit)
app.use('/my/news', information)
app.use('/my/category', category)
app.use('/my/category2', category2)
app.use('/my/books', books)
app.use('/my/cart', cart)
//错误中间件
// app.use((err, req, res, next) => {
//     //token错误
//     if (err.name === 'UnauthorizedError')
//         return res.send('身份认证失败！')
//     //验证错误
//     if (err instanceof joi.ValidationError)
//         return res.send(err)
//     //未知错误
//     return res.send(err)
// })

// 错误处理中间件
app.use((err, req, res, next) => {
    console.error(err.stack);
    if (err.name === 'UnauthorizedError') {
      return res.status(401).send('身份认证失败！');
    } else if (err instanceof joi.ValidationError) {
      return res.status(400).send(err);
    } else {
      return res.status(500).send({
        message: 'Internal server error',
        error: err.toString()
      });
    }
  });

// 启动服务器
app.listen(80, () => {
    console.log('app server run at http://127.0.0.1');
})