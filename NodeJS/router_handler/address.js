// 路由处理模块
//导入数据库模块
const db = require('../db/index')
// 导入时间处理函数
const { timeDate } = require('../utils/Time')
// 导入公共函数
const { isUser } = require('../utils/funtion')

//添加地址
exports.addressAdd = async (req, res) => {
    const { address } = req.body
    const uid = req.auth.id

    const sqlUserSel = 'select * from users where id = :id'
    const resUserSel = await db.executeQuery(sqlUserSel, { id: uid, })
    if (resUserSel.data.length !== 1) {
        return res.result('未找到该用户')
    }

    const sqlSelRess = 'select * from address where address = :address and uid = :uid'
    const resSelRess = await db.executeQuery(sqlSelRess,{address,uid})
    if(resSelRess.data.length >= 1){
        return res.result('已有该地址')
    }

    const sql = 'INSERT INTO address (uid,address,`default`) VALUES (:uid,:address,0)'
    const ressql = await db.executeQuery(sql, {uid,address})

    return res.result('地址添加成功！', 0)
}

//删除地址
exports.addressDel = async (req, res) => {
    const { id } = req.body

    const sqlSel = 'select * from address where id = :id'
    const resSel = await db.executeQuery(sqlSel, {id})
    if (resSel.data.length !== 1) {
        return res.result('未找到该地址!')
    }

    const sql = 'DELETE FROM address WHERE id = :id'
    const ressql = await db.executeQuery(sql, {id})

    return res.result('删除成功！', 0)
}

//更改地址
exports.addressUp = async (req, res) => {
    const { id,address } = req.body

    const sqlSel = 'select * from address where id = :id'
    const resSel = await db.executeQuery(sqlSel, {id})
    if (resSel.data.length !== 1) {
        return res.result('未找到该地址!')
    }

    const sqlUp = 'UPDATE address SET address = :address WHERE id = :id'
    const sql = await db.executeQuery(sqlUp, {address,id})

    return res.result('更新成功！', 0)
}

// 查询地址
exports.addressSel = async (req, res) => {
    const formDate = req.query

    // page 是当前页码。
    // itemsPerPage 是每页显示的项目数量

    // 计算 offset(从哪一行开始返回数据)
    const offset = (formDate.page - 1) * formDate.itemsPerPage;
    //LIMIT 用于限制查询结果的行数。
    //OFFSET 用于指定从哪一行开始返回数据。
    const sql = `SELECT 
                    address.id,
                    address.uid,
                    address.address,
                    address.default,
                    users.nickname AS uValue
                    FROM 
                        address
                    LEFT JOIN 
                        users ON address.uid = users.id
		            LIMIT ${formDate.itemsPerPage} OFFSET ${offset}`
    const resSel = await db.executeQuery(sql);
    if (resSel.data.length < 1) {
        return res.result('暂无购物车信息')
    }
    // 查询获取数据总数 
    const sqlCount = 'SELECT COUNT(*) AS count FROM address'
    const resCount = await db.executeQuery(sqlCount)
    const count = resCount.data[0].count

    // 返回结果
    return res.result('购物车获取成功！', 0, {
        value: resSel.data,
        count
    })
}

// 设置默认地址
exports.addressDef = async (req, res) => {
    const { id } = req.body
    const uid = req.auth.id

    const sqlSelad = 'select * from address where id = :id'
    const resSelad = await db.executeQuery(sqlSelad, {id})
    if (resSelad.data.length !== 1) {
        return res.result('未找到该地址!')
    }
    const sqlSelus = 'select * from address where uid = :uid'
    const resSelus = await db.executeQuery(sqlSelus, {uid})
    if (resSelus.data.length < 1) {
        return res.result('未找到该用户!')
    }


    const sqlUpUs = 'UPDATE address SET `default` = 0 WHERE uid = :uid'
    const ressqlUpUs = await db.executeQuery(sqlUpUs, {uid})
    const sqlUp = 'UPDATE address SET `default` = 1 WHERE id = :id'
    const ressql = await db.executeQuery(sqlUp, {id})
    return res.result('设置成功！', 0)
}