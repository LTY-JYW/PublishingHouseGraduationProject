//导入express模块————用于创建服务器
const express = require('express')
//创建服务器实例
const app = express()
//导入cors模块————用于解决跨域问题
const cors = require('cors')
//导入验证模块
const joi = require('joi')
//导入全局解析token的中间件
const {expressjwt:jwt} = require('express-jwt')
//导入全局配置文件（主页用于解析token）
const config = require('./config.js')
//导入lodash库（用于判断对象是否相等）
const lodash = require('lodash')
//注册中间件
app.use(cors())

//配置解析application/x-www-form-urlencoded的中间件
app.use(express.urlencoded({ extended: false }))
//配置解析application/json的中间件
app.use(express.json())

//统一返回值的中间件
app.use(function (req, res, next) {
    res.result = async (err, status = 1, data = {}) => {
        if(lodash.isEqual(data,{})){
            await res.send({
                status,
                message: err instanceof Error ? err.message : err,
            })
            next()
            return
        }

        await res.send({
            status,
            message: err instanceof Error ? err.message : err,
            data
        })
    }
    next()
})

//全局解析token的中间件
app.use(jwt({
    secret:config.jwtSecretKey,
    algorithms: ["HS256"]
}).unless({
    path: [/^\/api\//]
}))

//调用路由模块
const userRouter = require('./router/user')
const userInfo = require('./router/userInfo.js')
//api开头无需token认证
app.use('/api',userRouter)
//my开头需要token认证
app.use('/my',userInfo)


//错误中间件
app.use((err,req,res,next)=>{
    //token错误
    if(err.name === 'UnauthorizedError')
        return res.result('身份认证失败！')
    //验证错误
    if(err instanceof joi.ValidationError)
        return res.result(err)
    //未知错误
    return res.result(err)
})


// 启动服务器
app.listen(80, () => {
    console.log('app server run at http://127.0.0.1');
})