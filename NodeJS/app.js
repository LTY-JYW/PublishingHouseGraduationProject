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

// 启用环境变量
require('dotenv').config()

const upload = multer({ storage: multer.memoryStorage() })
// upload.uploadImgFile = upload.single('fileName'); // 假设上传的表单字段名为 'img'

//注册中间件跨域
app.use(cors())

// 配置 Multer 中间件
app.use('/api/upload', upload.single('file'), (req, res, next) => {
    if (!req.file) {
        return res.status(400).send('中间件报错，未找到文件！')
    }
    next()
})

//配置解析application/x-www-form-urlencoded的中间件
app.use(express.urlencoded({ extended: false, limit: '50mb' }))
//配置解析application/json的中间件
app.use(express.json())
//统一返回值的中间件
app.use(function (req, res, next) {
    res.result = async (err, code = 1, data = {}) => {
        if (lodash.isEqual(data, {})) {
            res.status = 50
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
const informationApi = require('./router/informationApi.js')
const category = require('./router/category.js')
const category2 = require('./router/category2.js')
const category2Api = require('./router/category2Api.js')
const books = require('./router/books.js')
const booksApi = require('./router/booksApi.js')
const cart = require('./router/cart.js')
const uploads = require('./router/uploads.js')
const address = require('./router/address.js')
const email = require('./router/email.js')
//api开头无需token认证
app.use('/api', userRouter)
app.use('/api', uploads)
app.use('/api/admin', adminlogin)
app.use('/api/audit', auditLogin)
app.use('/api/books', booksApi)
app.use('/api/news', informationApi)
app.use('/api/category2', category2Api)
app.use('/api/email', email)
app.use('/api/upload', uploads)
//my开头需要token认证
app.use('/my', userInfo)
app.use('/my/admin', admin)
app.use('/my/audit', audit)
app.use('/my/news', information)
app.use('/my/category', category)
app.use('/my/category2', category2)
app.use('/my/books', books)
app.use('/my/cart', cart)
app.use('/my/address', address)


// 错误处理中间件
app.use((err, req, res, next) => {
    if (err.name === 'UnauthorizedError') {
        return res.status(401).send('身份认证失败！');
    } else if (err instanceof joi.ValidationError) {
        return res.status(400).send(err.message);
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