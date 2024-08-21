// 路由处理模块
//导入数据库模块
const db = require('../db/index')
//导入同意错误返回信息
const { isNoRes } = require('../utils/resNo')

//添加购物车处理模块
exports.addCart = async (req, res) => {
    const {bid} = req.body
    const uid = req.auth.id
    const sqlSel = 'select * from books where id = :bid'
    const resSel = await db.executeQuery(sqlSel,{bid})
    isNoRes(resSel)
    if (resSel.data.length !== 1){
        return res.result('未找到该图书！')
    }

    const sqlSelCart = 'select * from cart where uid = :uid and bid = :bid'
    const resSelCart = await db.executeQuery(sqlSelCart,{uid,bid})
    isNoRes(resSelCart)
    if(resSelCart.data.length >=1){
        return res.result('该商品已添加过购物车！')
    }

    const sqlAdd = 'INSERT INTO cart (uid,bid,price,count) VALUES (:uid,:bid,:price,1)'
    const resAdd = await db.executeQuery(sqlAdd,{uid,bid,price:resSel.data[0].price})
    isNoRes(resAdd)
    return res.result('添加购物车成功！',0)
}

// 移除购物车(购物车非重要信息直接删除)
exports.delCart = async (req,res) => {
    const { id } = req.body

    const sqlSelCart = 'select * from cart where id = :id'
    const resSelCart = await db.executeQuery(sqlSelCart,{id})
    isNoRes(resSelCart)
    if(resSelCart.data.length !== 1){
        return res.result('未找到购物车！')
    }

    const sqlDel = 'DELETE FROM cart WHERE id = :id'
    const resDel = await db.executeQuery(sqlDel,{id})
    isNoRes(resDel)
    return res.result('删除成功！',0)
}

// 更改购物车数量
exports.upCart = async (req,res) => {
    const { id,count } = req.body

    const sqlSelCart = 'select * from cart where id = :id'
    const resSelCart = await db.executeQuery(sqlSelCart,{id})
    isNoRes(resSelCart)
    if(resSelCart.data.length !== 1){
        return res.result('未找到购物车！')
    }

    const sqlDel = 'UPDATE cart SET count = :count WHERE id = :id'
    const resDel = await db.executeQuery(sqlDel,{id,count})
    isNoRes(resDel)
    return res.result('修改成功！',0)
}

// 查询该用户购物车信息
exports.getCart = async (req,res) => {
    const uid = req.auth.id

    const sqlSelCart = 'select * from cart where uid = :uid'
    const resSelCart = await db.executeQuery(sqlSelCart,{uid})
    isNoRes(resSelCart)
    return res.result('查询成功！',0,resSelCart.data)
}
