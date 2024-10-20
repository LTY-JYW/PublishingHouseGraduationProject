// 路由处理模块
//导入数据库模块
const db = require('../db/index')
//导入同意错误返回信息
// 导入时间处理函数
const { timeDate } = require('../utils/Time')
// 导入公共函数
const { isUser, isAdmin } = require('../utils/funtion')
// const { timeDate } = require('../utils/Time')

//发布订单处理模块
exports.orderAdd = async (req, res) => {
    if (isUser(req, res)) {
        return res.result('该接口限用户调用')
    }
    const { bid, count } = req.body
    console.log(req.body);
    const uid = req.auth.id
    const sqlBookSel = `select * from books where id = ${bid} and isdelete = 0`
    const ResBookSel = await db.executeQuery(sqlBookSel)
    if (ResBookSel.data.length != 1) {
        return res.result('未找到该图书！')
    }
    const sqlUserSel = `select * from users where id = ${uid} and disable = 0`
    const ResUserSel = await db.executeQuery(sqlUserSel)
    if (ResUserSel.data.length != 1) {
        return res.result('未找到该用户！')
    }
    const sqlAddOrder = 'INSERT INTO `order` (bid,uid,shipping,time,count) VALUES (:bid,:uid,:shipping,:time,:count)'
    const resAddOrder = await db.executeQuery(sqlAddOrder, {
        bid,
        uid,
        shipping: 0,
        time: timeDate(new Date()),
        count
    })
    return res.result('添加订单成功！', 0, resAddOrder.data)
}

// 删除订单处理模块
exports.orderDel = async (req, res) => {
    if (isAdmin(req, res)) {
        return res.result('该接口限管理员调用')
    }
    const { id } = req.query
    const sqlOrderSel = `select * from \`order\` where id = ${id}`
    const ResOrderSel = await db.executeQuery(sqlOrderSel)
    if (ResOrderSel.data.length != 1) {
        return res.result('未找到该订单！')
    }

    const sqlDelOrder = `DELETE FROM \`order\` WHERE id = :id`
    const resDelOrder = await db.executeQuery(sqlDelOrder, { id })
    return res.result('删除订单成功！', 0, resDelOrder.data)
}

// 发货处理模块
exports.orderUp = async (req, res) => {
    if (isAdmin(req, res)) {
        return res.result('该接口限管理员调用')
    }
    const { id } = req.query
    const sqlOrderSel = 'select * from `order` where id = :id'
    const ResOrderSel = await db.executeQuery(sqlOrderSel, { id })
    if (ResOrderSel.data.length != 1) {
        return res.result('未找到该订单！')
    }

    const sqlUpOrder = 'UPDATE `order` SET shipping = 1 WHERE id = :id'
    const resUpOrder = await db.executeQuery(sqlUpOrder, { id })
    return res.result('发货成功！', 0, resUpOrder.data)
}

// 获取订单处理模块
exports.orderSel = async (req, res) => {
    if (isUser(req, res)) {
        return res.result('该接口限用户调用')
    }
    const id = req.auth.id
    const { page, itemsPerPage } = req.query
    // page 是当前页码。
    // itemsPerPage 是每页显示的项目数量
    // 计算 offset(从哪一行开始返回数据)
    const offset = (page - 1) * itemsPerPage;
    const sqlUsersrSel = `select * from users where id = ${id}`
    const ResUsersrSel = await db.executeQuery(sqlUsersrSel)
    if (ResUsersrSel.data.length != 1) {
        return res.result('未找到该用户！')
    }

    const sqlSelOrder = `SELECT 
                            \`order\`.id, \`order\`.uid,\`order\`.bid, \`order\`.shipping,\`order\`.time,\`order\`.count,
                            users.nickname AS nickname,users.phoneNumber AS phoneNumber,books.name AS bookName,books.cover AS cover,books.price AS price
                    FROM \`order\`
                    LEFT JOIN books ON \`order\`.bid = books.id
                    LEFT JOIN users ON \`order\`.uid = users.id
                    WHERE \`order\`.uid = ${id}
                    ORDER BY 
                        \`order\`.time DESC
                    LIMIT ${itemsPerPage} OFFSET ${offset}
                    `
    const resSelOrder = await db.executeQuery(sqlSelOrder)

    // 查询获取数据总数 
    const sqlCount = 'SELECT COUNT(*) AS count FROM `order`'
    const resCount = await db.executeQuery(sqlCount)
    const count = resCount.data[0].count
    return res.result('查询订单成功！', 0, {
        value: resSelOrder.data,
        count
    })
    // return res.result('查询订单成功！', 0, resSelOrder.data)
}

// 查询订单详细信息
exports.orderSelInfo = async (req, res) => {
    if (isUser(req, res)) {
        return res.result('该接口限用户调用')
    }
    const oid = req.query.id
    const id = req.auth.id
    const sqlUsersrSel = `select * from users where id = ${id}`
    const ResUsersrSel = await db.executeQuery(sqlUsersrSel)
    if (ResUsersrSel.data.length != 1) {
        return res.result('未找到该用户！')
    }

    const sqlSelOrder = `SELECT 
                            \`order\`.id, \`order\`.uid,\`order\`.bid, \`order\`.shipping,\`order\`.time,\`order\`.count,
                            users.nickname AS nickname,users.phoneNumber AS phoneNumber,books.name AS bookName,books.cover AS cover,books.price AS price
                    FROM \`order\`
                    LEFT JOIN books ON \`order\`.bid = books.id
                    LEFT JOIN users ON \`order\`.uid = users.id
                    WHERE \`order\`.uid = ${id} AND \`order\`.id = ${oid}
                    ORDER BY 
                        \`order\`.time DESC
                    `
    const resSelOrder = await db.executeQuery(sqlSelOrder)

    const sqlAddress = `SELECT 
                            *
                    FROM address
                    WHERE uid = ${id}
                    `
    const resAddress = await db.executeQuery(sqlAddress)
    if (resAddress.data.length < 1) {
        return res.result('无地址！')
    }
    return res.result('查询订单成功！', 0, {
        order: resSelOrder.data[0],
        address: resAddress.data
    })
}