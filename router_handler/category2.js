// 路由处理模块
//导入数据库模块
const db = require('../db/index')
//导入同意错误返回信息
const { isNoRes } = require('../utils/resNo')

//添加二级分类处理模块
exports.add = async (req, res) => {
    const formData = req.body
    const sqlSel = 'select * from category where id = :id'
    const resSel = await db.executeQuery(sqlSel,{id:formData.cid})
    isNoRes(resSel)
    if(resSel.data.length !== 1){
        return res.result('未找到对应一级分类！')
    }

    const sqlSelTwo = 'select * from category2 where name = :name'
    const resSelTwo = await db.executeQuery(sqlSelTwo,{name:formData.name})
    isNoRes(resSelTwo)
    if(resSelTwo.data.length >= 1){
        return res.result('该分类名已存在')
    }

    const sql = 'INSERT INTO category2 (name, profile,cid) VALUES (:name, :profile,:cid)';
    const resAdd = await db.executeQuery(sql, { name: formData.name, profile: formData.profile, cid:formData.cid })
    isNoRes(resAdd)
    return res.result('添加成功！', 0)
}


//删除二级分类（分类认为非重要数据实现删除操作）
exports.delete = async (req,res) => {
    const sqlSel = 'select * from category2 where id = :id'
    const resSel = await db.executeQuery(sqlSel,{id: req.body.id})
    isNoRes(resSel)
    if (resSel.data.length !== 1){
        return res.result('未找到该分类！')
    }
    const sql = 'DELETE FROM category2 WHERE id = :id'
    const resDel = await db.executeQuery(sql,{id: req.body.id})
    isNoRes(resDel)
    return res.result('删除成功!',0)
}

// 查询一级分类对应的二级分类
exports.sel = async (req,res) => {
    const formDate = req.body
    console.log(formDate);
    const sql = 'SELECT * FROM category2 where cid = :cid'
    const resSel = await db.executeQuery(sql,{ cid: formDate.cid});
    if(resSel.data.length < 1){
        return res.result('暂无分类信息')
    }
    isNoRes(resSel)
    return res.result('获取成功！',0,resSel.data)

}

//更新二级分类
exports.upData = async (req,res) => {
    const forData = req.body
    const sqlSel = 'select * from category2 where id = :id'
    const resSel = await db.executeQuery(sqlSel,{id: forData.id})
    isNoRes(resSel)
    if (resSel.data.length !== 1){
        return res.result('未找到该分类！')
    }
    const sqlUp = 'UPDATE category2 SET name = :name,profile = :profile WHERE id = :id'
    const resUp = await db.executeQuery(sqlUp,{ name:forData.name, profile:forData.profile, id:forData.id})
    isNoRes(resUp)
    return res.result('更新成功！',0)
}