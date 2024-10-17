// 路由处理模块
//导入数据库模块
const { limit } = require('@hapi/joi/lib/common')
const db = require('../db/index')
//导入时间处理模块
const { timeDate } = require('../utils/Time')

//发布资讯
exports.add = async (req, res) => {
    const uid = req.auth.id
    const formData = req.body
    const time = new Date()

    const sqlSel = 'select * from information where title = :title'
    const resSel = await db.executeQuery(sqlSel,{title:formData.title})
    if(resSel.data.length >= 1){
        return res.result('标题重复！请更换标题后重试！')
    }
    const sql = 'INSERT INTO information (title, main, time, disable,count,cover) VALUES (:title, :main, :time, 2,0,:cover)';
    const resAdd = await db.executeQuery(sql, { title: formData.title, main: formData.main, time: timeDate(time),cover:formData.cover})
    return res.result('发表成功！', 0)
}

//删除资讯（资讯认为非重要数据实现删除操作）
exports.delete = async (req, res) => {
    const sqlSel = 'select * from information where id = :id'
    const resSel = await db.executeQuery(sqlSel, { id: req.query.id })
    if (resSel.data.length !== 1) {
        return res.result('未找到该资讯！')
    }
    const sql = 'DELETE FROM information WHERE id = :id'
    const resDel = await db.executeQuery(sql, { id: req.query.id })
    return res.result('删除成功!', 0)
}

// 查询资讯
exports.sel = async (req, res) => {
    const formDate = req.query
    // page 是当前页码。
    // itemsPerPage 是每页显示的项目数量
    // by 是按照什么来进行排序
    // des 是升序还是降序
    // 计算 offset(从哪一行开始返回数据)
    const offset = (formDate.page - 1) * formDate.itemsPerPage;
    //LIMIT 用于限制查询结果的行数。
    //OFFSET 用于指定从哪一行开始返回数据。
    // const sql = `SELECT * FROM information ORDER BY ${formDate.by} ${formDate.des} LIMIT ${formDate.itemsPerPage} OFFSET ${offset}`
    const sql = `SELECT 
                    information.id,
                    information.title,
                    information.main,
                    information.time,
                    information.audit_id,
                    information.count,
                    information.disable,
                    information.cover,
		            audit.nickname AS aValue
                    FROM 
                        information
                    LEFT JOIN 
                        audit ON information.audit_id = audit.id
                    ORDER BY 
                        ${formDate.by} ${formDate.des}
		            LIMIT ${formDate.itemsPerPage} OFFSET ${offset}`
    const resSel = await db.executeQuery(sql);
    if (resSel.data.length < 1) {
        return res.result('暂无资讯信息',0,{value:undefined})
    }
    // 查询获取数据总数 
    const sqlCount = 'SELECT COUNT(*) AS count FROM information'
    const resCount = await db.executeQuery(sqlCount)
    const count = resCount.data[0].count

    // 返回结果
    return res.result('获取成功！', 0, {
        value: resSel.data,
        count
    })
}

// 查询审核通过资讯
exports.selApproved = async (req, res) => {
    const formDate = req.query
    // page 是当前页码。
    // itemsPerPage 是每页显示的项目数量
    // by 是按照什么来进行排序
    // des 是升序还是降序
    // 计算 offset(从哪一行开始返回数据)
    const offset = (formDate.page - 1) * formDate.itemsPerPage;
    //LIMIT 用于限制查询结果的行数。
    //OFFSET 用于指定从哪一行开始返回数据。
    const sql = `SELECT 
                    information.id,
                    information.title,
                    information.main,
                    information.time,
                    information.audit_id,
                    information.count,
                    information.disable,
                    information.cover,
		            audit.nickname AS aValue
                    FROM 
                        information
                    LEFT JOIN 
                        audit ON information.audit_id = audit.id
                    WHERE disable = 0
                    ORDER BY 
                        ${formDate.by} ${formDate.des}
		            LIMIT ${formDate.itemsPerPage} OFFSET ${offset}`
    const resSel = await db.executeQuery(sql);
    if (resSel.data.length < 1) {
        return res.result('暂无资讯信息',0,{value:undefined})
    }
    // 查询获取数据总数 
    const sqlCount = 'SELECT COUNT(*) AS count FROM information WHERE disable = 0'
    const resCount = await db.executeQuery(sqlCount)
    const count = resCount.data[0].count

    // 返回结果
    return res.result('资讯获取成功！', 0, {
        value: resSel.data,
        count
    })
}

// 查询资讯详细信息
exports.selInfo = async (req,res) => {
    const { id } = req.query
    const sql = 'SELECT * FROM information WHERE disable = 0 and id = :id'
    const rest = await db.executeQuery(sql,{id})
    if(rest.data.length != 1){
        return res.result('未找到资讯')
    }

    return res.result('资讯详细信息查询成功',0,rest.data)
}

// 资讯浏览量
exports.views = async (req,res) => {
    const { id } = req.body
    const sql = 'SELECT * FROM information WHERE disable = 0 and id = :id'
    const rest = await db.executeQuery(sql,{id})
    if(rest.data.length != 1){
        return res.result('未找到资讯')
    }

    const sqlViews = 'UPDATE information SET count = :count WHERE id = :id'
    const resViews = await db.executeQuery(sqlViews,{ count:rest.data[0].count+1, id})

    return res.result('浏览！', 0, {
        value: '浏览',
    })
}