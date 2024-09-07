// 路由处理模块
//导入数据库模块
const db = require('../db/index')
//导入同意错误返回信息
const { isNoRes } = require('../utils/resNo')
// 导入时间处理函数
const { timeDate } = require('../utils/Time')

//发布图书处理模块
exports.addBooks = async (req, res) => {
    const formDate = req.body
    const uid = req.auth.id
    const time = new Date
    const sqlUserSel = 'select * from users where id = :id and isAuthor = 1'
    const resUserSel = await db.executeQuery(sqlUserSel, { id: uid, })
    isNoRes(resUserSel)
    if (resUserSel.data.length !== 1) {
        return res.result('该用户非作者！')
    }

    const sqlCategorySel = 'select * from category2 where id = :id'
    const resCategorySel = await db.executeQuery(sqlCategorySel, { id: formDate.cid })
    isNoRes(resCategorySel)
    if (resCategorySel.data.length !== 1) {
        return res.result('未找到该分类！')
    }

    const sqlBooksSel = 'select * from books where name = :name'
    const resBooksSel = await db.executeQuery(sqlBooksSel, { name: formDate.name })
    isNoRes(resBooksSel)
    if (resBooksSel.data.length >= 1) {
        return res.result('已有该书籍名称')
    }

    const sqlBooksAdd = 'INSERT INTO books (cid,uid,name,profile,time,edition,price,pages,number,topic,popularity,cover,disable,isdelete) VALUES (:cid,:uid,:name,:profile,:time,:edition,:price,:pages,:number,:topic,:popularity,:cover,2,0)'
    const resBooksAdd = await db.executeQuery(sqlBooksAdd, {
        cid: formDate.cid,
        uid,
        name: formDate.name,
        profile: formDate.profile,
        time: timeDate(time),
        edition: formDate.edition,
        price: formDate.price,
        pages: formDate.pages,
        number: formDate.number,
        topic: formDate.topic,
        popularity: 0,
        cover: formDate.cover,
    })
    isNoRes(resBooksAdd)

    return res.result('发布图书成功！', 0)
}

// 删除图书(图书为重要数据为保证数据完整性使用标记删除)
exports.deleteBooks = async (req, res) => {
    const formDate = req.body
    const sqlSel = 'select * from books where id = :id'
    const resSel = await db.executeQuery(sqlSel, { id: formDate.id })
    isNoRes(resSel)
    if (resSel.data.length !== 1) {
        return res.result('没有该图书！')
    }
    const sqlSelDel = 'select * from books where id = :id and isdelete = 1'
    const resSelDel = await db.executeQuery(sqlSelDel, { id: formDate.id })
    isNoRes(resSelDel)
    if (resSelDel.data.length === 1) {
        return res.result('该图书已被删除！')
    }


    const sqlDel = 'UPDATE books SET isdelete = :isdelete WHERE id = :id'
    const resDel = await db.executeQuery(sqlDel, { isdelete: 1, id: formDate.id })
    isNoRes(resDel)
    return res.result('删除成功！', 0)
}

// 更新图书信息
exports.updateBooks = async (req, res) => {
    const formDate = req.body
    const sqlSel = 'select * from books where id = :id'
    const resSel = await db.executeQuery(sqlSel, { id: formDate.id })
    isNoRes(resSel)
    if (resSel.data.length !== 1) {
        return res.result('没有该图书！')
    }


    const sqlCategorySel = 'select * from category2 where id = :id'
    const resCategorySel = await db.executeQuery(sqlCategorySel, { id: formDate.cid })
    isNoRes(resCategorySel)
    if (resCategorySel.data.length !== 1) {
        return res.result('未找到该分类！')
    }


    const { cid, name, profile, edition, price, pages, number, topic, cover, id } = formDate
    const sqlUp = 'UPDATE books SET cid = :cid,name = :name,profile = :profile,edition = :edition,price = :price,pages = :pages,number = :number,topic = :topic,cover = :cover WHERE id = :id'
    const resUp = await db.executeQuery(sqlUp, {
        cid,
        name,
        profile,
        edition,
        price,
        pages,
        number,
        topic,
        cover,
        id
    })
    isNoRes(resUp)
    return res.result('修改成功！', 0)
}

// 查询所有图书信息
exports.selOveryBooks = async (req, res) => {
    const formDate = req.query
    // page 是当前页码。
    // itemsPerPage 是每页显示的项目数量
    // by 是按照什么来进行排序
    // des 是升序还是降序
    // 计算 offset(从哪一行开始返回数据)
    const offset = (formDate.page - 1) * formDate.itemsPerPage;
    //LIMIT 用于限制查询结果的行数。
    //OFFSET 用于指定从哪一行开始返回数据。
    const sql = `SELECT * FROM books ORDER BY ${formDate.by} ${formDate.des} LIMIT ${formDate.itemsPerPage} OFFSET ${offset}`
    const resSel = await db.executeQuery(sql);
    if (resSel.data.length < 1) {
        return res.result('暂无图书信息')
    }
    isNoRes(resSel)

    // 查询获取数据总数 
    const sqlCount = 'SELECT COUNT(*) AS count FROM books'
    const resCount = await db.executeQuery(sqlCount)
    isNoRes(resCount)
    const count = resCount.data[0].count
    console.log(count);

    return res.result('获取成功！', 0, {
        value: resSel.data,
        count
    })

}

// 查询对应分类图书信息
exports.selCatergoryBooks = async (req, res) => {
    const formDate = req.body

    const sqlCategorySel = 'select * from category2 where id = :id'
    const resCategorySel = await db.executeQuery(sqlCategorySel, { id: formDate.cid })
    isNoRes(resCategorySel)
    if (resCategorySel.data.length !== 1) {
        return res.result('未找到该分类！')
    }

    // page 是当前页码。
    // itemsPerPage 是每页显示的项目数量
    // 计算 offset(从哪一行开始返回数据)
    const offset = (formDate.page - 1) * formDate.itemsPerPage;
    //LIMIT 用于限制查询结果的行数。
    //OFFSET 用于指定从哪一行开始返回数据。
    const sql = `SELECT * FROM books where cid = ${formDate.cid} LIMIT ${formDate.itemsPerPage} OFFSET ${offset} `
    const resSel = await db.executeQuery(sql);
    if (resSel.data.length < 1) {
        return res.result('暂无图书信息')
    }
    isNoRes(resSel)

    // 查询获取数据总数 
    const sqlCount = 'SELECT COUNT(*) AS count FROM books where cid = :cid'
    const resCount = await db.executeQuery(sqlCount,{cid:formDate.cid})
    isNoRes(resCount)
    const count = resCount.data[0].count

    return res.result('获取成功！', 0, {
        value: resSel.data,
        count
    })
}
// 查询对应图书详情信息
exports.selInfoBooks = async (req, res) => {
    const formDate = req.body
    const sql = 'SELECT * FROM books where id = :id'
    const resSel = await db.executeQuery(sql, { id: formDate.id });
    if (resSel.data.length < 1) {
        return res.result('暂无图书信息')
    }
    isNoRes(resSel)
    return res.result('获取成功！', 0, resSel.data)
}