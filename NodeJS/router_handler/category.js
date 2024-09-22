// 路由处理模块
//导入数据库模块
const db = require('../db/index')
//导入同意错误返回信息
const { isNoRes } = require('../utils/resNo')

//添加分类处理模块
exports.add = async (req, res) => {
    const formData = req.body
    const sqlSel = 'select * from category where name = :name'
    const resSel = await db.executeQuery(sqlSel, { name: formData.name })
    isNoRes(resSel)
    if (resSel.data.length >= 1) {
        return res.result('该分类名已存在')
    }
    const sql = 'INSERT INTO category (name, profile) VALUES (:name, :profile)'
    const resAdd = await db.executeQuery(sql, { name: formData.name, profile: formData.profile })
    isNoRes(resAdd)
    return res.result('添加成功！', 0)
}


//删除分类（分类认为非重要数据实现删除操作）
exports.delete = async (req, res) => {
    const formDate = req.query
    const sqlSel = 'select * from category where id = :id'
    const resSel = await db.executeQuery(sqlSel, { id: formDate.id })
    isNoRes(resSel)
    if (resSel.data.length !== 1) {
        return res.result('未找到该分类！')
    }
    const sql2Del = 'UPDATE category2 SET cid=NULL WHERE cid = :cid'
    const res2Del = await db.executeQuery(sql2Del, { cid: formDate.id })
    isNoRes(res2Del)
    const sql = 'DELETE FROM category WHERE id = :id'
    const resDel = await db.executeQuery(sql, { id: formDate.id })
    isNoRes(resDel)
    return res.result('删除成功!', 0)
}

// 查询一级分类列表
exports.sel = async (req, res) => {
    const formDate = req.query
    // page 是当前页码。
    // itemsPerPage 是每页显示的项目数量

    // 计算 offset(从哪一行开始返回数据)
    const offset = (formDate.page - 1) * formDate.itemsPerPage;
    //LIMIT 用于限制查询结果的行数。
    //OFFSET 用于指定从哪一行开始返回数据。
    const sql = `SELECT * FROM category LIMIT ${formDate.itemsPerPage} OFFSET ${offset}`
    const resSel = await db.executeQuery(sql);
    if (resSel.data.length < 1) {
        return res.result('暂无分类信息')
    }
    isNoRes(resSel)

    // 查询获取数据总数 
    const sqlCount = 'SELECT COUNT(*) AS count FROM category'
    const resCount = await db.executeQuery(sqlCount)
    isNoRes(resCount)
    const count = resCount.data[0].count

    // 返回结果
    return res.result('获取成功！', 0, {
        value: resSel.data,
        count
    })
}
// 查询一级分类列表
exports.selinfo = async (req, res) => {
    const {id} = req.query
    const sql = `SELECT * FROM category WHERE id = ${id}`
    const resSel = await db.executeQuery(sql);
    isNoRes(resSel)
    if (resSel.data.length < 1) {
        return res.result('暂无分类信息')
    }
    // 返回结果
    return res.result('获取成功！', 0, resSel.data)
}

//更新分类
exports.upData = async (req, res) => {
    const forData = req.body
    const sqlSel = 'select * from category where id = :id'
    const resSel = await db.executeQuery(sqlSel, { id: forData.id })
    isNoRes(resSel)
    if (resSel.data.length !== 1) {
        return res.result('未找到该分类！')
    }
    const sqlUp = 'UPDATE category SET name = :name,profile = :profile WHERE id = :id'
    const resUp = await db.executeQuery(sqlUp, { name: forData.name, profile: forData.profile, id: forData.id })
    isNoRes(resUp)
    return res.result('更新成功！', 0)
}