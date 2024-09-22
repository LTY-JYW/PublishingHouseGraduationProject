// 路由处理模块
//导入数据库模块
const db = require('../db/index')
//导入同意错误返回信息
const { isNoRes } = require('../utils/resNo')

//添加二级分类处理模块
exports.add = async (req, res) => {
    const formData = req.body
    const sqlSel = 'select * from category where id = :id'
    const resSel = await db.executeQuery(sqlSel, { id: formData.cid })
    isNoRes(resSel)
    if (resSel.data.length !== 1) {
        return res.result('未找到对应一级分类！')
    }

    const sqlSelTwo = 'select * from category2 where name = :name'
    const resSelTwo = await db.executeQuery(sqlSelTwo, { name: formData.name })
    isNoRes(resSelTwo)
    if (resSelTwo.data.length >= 1) {
        return res.result('该分类名已存在')
    }

    const sql = 'INSERT INTO category2 (name, profile,cid,cover) VALUES (:name, :profile,:cid,:cover)';
    const resAdd = await db.executeQuery(sql, { name: formData.name, profile: formData.profile, cid: formData.cid,cover:formData.cover })
    isNoRes(resAdd)
    return res.result('添加成功！', 0)
}


//删除二级分类（分类认为非重要数据实现删除操作）
exports.delete = async (req, res) => {
    const sqlSel = 'select * from category2 where id = :id'
    const resSel = await db.executeQuery(sqlSel, { id: req.query.id })
    isNoRes(resSel)
    if (resSel.data.length !== 1) {
        return res.result('未找到该分类！')
    }
    const sql = 'DELETE FROM category2 WHERE id = :id'
    const resDel = await db.executeQuery(sql, { id: req.query.id })
    isNoRes(resDel)

    const sqlBookSel = 'UPDATE books SET cid=NULL WHERE cid = :cid'
    const resBookSel = await db.executeQuery(sqlBookSel, { cid: req.query.id })
    isNoRes(resBookSel)

    return res.result('删除成功!', 0)
}

// 查询一级分类对应的二级分类
exports.sel = async (req, res) => {
    const formDate = req.query

    // page 是当前页码。
    // itemsPerPage 是每页显示的项目数量

    // 计算 offset(从哪一行开始返回数据)
    const offset = (formDate.page - 1) * formDate.itemsPerPage;
    //LIMIT 用于限制查询结果的行数。
    //OFFSET 用于指定从哪一行开始返回数据。
    const sql = `SELECT * FROM category2 where cid = :cid LIMIT ${formDate.itemsPerPage} OFFSET ${offset}`
    const resSel = await db.executeQuery(sql,{ cid: formDate.cid });
    if (resSel.data.length < 1) {
        return res.result('暂无分类信息')
    }
    isNoRes(resSel)
    // 查询获取数据总数 
    const sqlCount = 'SELECT COUNT(*) AS count FROM category2 where cid = :cid'
    const resCount = await db.executeQuery(sqlCount,{ cid: formDate.cid })
    isNoRes(resCount)
    const count = resCount.data[0].count

    // 返回结果
    return res.result('获取成功！', 0, {
        value: resSel.data,
        count
    })
}

// 查询所有二级分类
exports.overySel = async (req, res) => {
    const formDate = req.query

    // page 是当前页码。
    // itemsPerPage 是每页显示的项目数量

    // 计算 offset(从哪一行开始返回数据)
    const offset = (formDate.page - 1) * formDate.itemsPerPage;
    //LIMIT 用于限制查询结果的行数。
    //OFFSET 用于指定从哪一行开始返回数据。
    const sql = `SELECT * FROM category2 LIMIT ${formDate.itemsPerPage} OFFSET ${offset}`
    const resSel = await db.executeQuery(sql,{ cid: formDate.cid });
    if (resSel.data.length < 1) {
        return res.result('暂无分类信息')
    }
    isNoRes(resSel)
    // 查询获取数据总数 
    const sqlCount = 'SELECT COUNT(*) AS count FROM category2'
    const resCount = await db.executeQuery(sqlCount,{ cid: formDate.cid })
    isNoRes(resCount)
    const count = resCount.data[0].count

    // 返回结果
    return res.result('获取成功！', 0, {
        value: resSel.data,
        count
    })
}

//更新二级分类
exports.upData = async (req, res) => {
    const {name,profile,cid,cover,id} = req.body
    const sqlSel = 'select * from category2 where id = :id'
    const resSel = await db.executeQuery(sqlSel, { id })
    isNoRes(resSel)
    if (resSel.data.length !== 1) {
        return res.result('未找到该分类！')
    }
    const sqlUp = 'UPDATE category2 SET name = :name,profile = :profile,cid = :cid,cover = :cover WHERE id = :id'
    const resUp = await db.executeQuery(sqlUp, { name, profile, cid, cover,id })
    isNoRes(resUp)
    return res.result('更新成功！', 0)
}
// 获取二级分类详细信息
exports.getInfo = async (req,res) => {
    const formData = req.query
    const sqlSel = 'select * from category2 where id = :id'
    const resSel = await db.executeQuery(sqlSel, { id: formData.id })
    isNoRes(resSel)
    if (resSel.data.length !== 1) {
        return res.result('未找到该分类！')
    }
    return res.result('查询成功！', 0,resSel.data)
}