// 路由处理模块
//导入数据库模块
const { limit } = require('@hapi/joi/lib/common')
const db = require('../db/index')
//导入同一错误返回信息
const { isNoRes } = require('../utils/resNo')
//导入时间处理模块
const { timeDate } = require('../utils/Time')

//发布资讯
exports.add = async (req, res) => {
    const uid = req.auth.id
    const formData = req.body
    const time = new Date()
    const sql =  'INSERT INTO information (title, main, time, author_id, disable) VALUES (:title, :main, :time, :author_id, 2)';
    const resAdd = await db.executeQuery(sql,{title:formData.title,main:formData.main,time:timeDate(time),author_id:uid})
    isNoRes(resAdd)
    return res.result('发表成功！',0)
}

//删除资讯（资讯认为非重要数据实现删除操作）
exports.delete = async (req,res) => {
    const sqlSel = 'select * from information where id = :id'
    const resSel = await db.executeQuery(sqlSel,{id: req.body.id})
    isNoRes(resSel)
    if (resSel.data.length !== 1){
        return res.result('未找到该资讯！')
    }
    const sql = 'DELETE FROM information WHERE id = :id'
    const resDel = await db.executeQuery(sql,{id: req.body.id})
    isNoRes(resDel)
    return res.result('删除成功!',0)
}

// 查询资讯
exports.sel = async (req,res) => {
    const formDate = req.body
    // page 是当前页码。
    // itemsPerPage 是每页显示的项目数量
    // by 是按照什么来进行排序
    // des 是升序还是降序
    // 计算 offset(从哪一行开始返回数据)
    const offset = (formDate.page - 1) * formDate.itemsPerPage;
    //LIMIT 用于限制查询结果的行数。
    //OFFSET 用于指定从哪一行开始返回数据。
    const sql = `SELECT * FROM information ORDER BY ${formDate.by} ${formDate.des} LIMIT ${formDate.itemsPerPage} OFFSET ${offset}`
    const resSel = await db.executeQuery(sql);
    if(resSel.data.length < 1){
        return res.result('暂无资讯信息')
    }
    isNoRes(resSel)
    return res.result('获取成功！',0,resSel.data)

}