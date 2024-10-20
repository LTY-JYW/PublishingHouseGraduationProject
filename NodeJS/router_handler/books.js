// 路由处理模块
//导入数据库模块
const db = require('../db/index')
//导入同意错误返回信息
// 导入时间处理函数
const { timeDate } = require('../utils/Time')

//发布图书处理模块
exports.addBooks = async (req, res) => {
    const formDate = req.body
    const uid = req.auth.id
    const time = new Date
    const sqlUserSel = 'select * from users where id = :id and isAuthor = 1'
    const resUserSel = await db.executeQuery(sqlUserSel, { id: uid, })
    if (resUserSel.data.length !== 1) {
        return res.result('该用户非作者！')
    }

    const sqlCategorySel = 'select * from category2 where id = :id'
    const resCategorySel = await db.executeQuery(sqlCategorySel, { id: formDate.cid })
    if (resCategorySel.data.length !== 1) {
        return res.result('未找到该分类！')
    }

    const sqlBooksSel = 'select * from books where name = :name'
    const resBooksSel = await db.executeQuery(sqlBooksSel, { name: formDate.name })
    if (resBooksSel.data.length >= 1) {
        return res.result('已有该书籍名称')
    }

    const sqlBooksAdd = 'INSERT INTO books (cid,uid,name,profile,time,edition,price,pages,popularity,cover,disable,isdelete,preview) VALUES (:cid,:uid,:name,:profile,:time,:edition,:price,:pages,:popularity,:cover,2,0,:preview)'
    const resBooksAdd = await db.executeQuery(sqlBooksAdd, {
        cid: formDate.cid,
        uid,
        name: formDate.name,
        profile: formDate.profile,
        time: timeDate(time),
        edition: formDate.edition,
        price: formDate.price,
        pages: formDate.pages,
        popularity: 0,
        cover: formDate.cover,
        preview:formDate.preview
    })

    return res.result('发布图书成功！', 0)
}

// 删除图书(图书为重要数据为保证数据完整性使用标记删除)
exports.deleteBooks = async (req, res) => {
    const formDate = req.query
    const sqlSel = 'select * from books where id = :id'
    const resSel = await db.executeQuery(sqlSel, { id: formDate.id })
    if (resSel.data.length !== 1) {
        return res.result('没有该图书！')
    }
    const sqlSelDel = 'select * from books where id = :id and isdelete = 1'
    const resSelDel = await db.executeQuery(sqlSelDel, { id: formDate.id })
    if (resSelDel.data.length === 1) {
        return res.result('该图书已被删除！')
    }

    const sqlDel = 'UPDATE books SET isdelete = :isdelete WHERE id = :id'
    const resDel = await db.executeQuery(sqlDel, { isdelete: 1, id: formDate.id })
    return res.result('删除成功！', 0)
}

// 恢复图书
exports.restoreBooks = async (req, res) => {
    const formDate = req.body
    const sqlSel = 'select * from books where id = :id'
    const resSel = await db.executeQuery(sqlSel, { id: formDate.id })
    if (resSel.data.length !== 1) {
        return res.result('没有该图书！')
    }
    const sqlSelDel = 'select * from books where id = :id and isdelete = 0'
    const resSelDel = await db.executeQuery(sqlSelDel, { id: formDate.id })
    if (resSelDel.data.length === 1) {
        return res.result('该图书未被删除！')
    }
    const sqlDel = 'UPDATE books SET isdelete = :isdelete WHERE id = :id'
    const resDel = await db.executeQuery(sqlDel, { isdelete: 0, id: formDate.id })
    return res.result('恢复成功！', 0)
}

// 更新图书信息
exports.updateBooks = async (req, res) => {
    const formDate = req.body
    const sqlSel = 'select * from books where id = :id'
    const resSel = await db.executeQuery(sqlSel, { id: formDate.id })
    if (resSel.data.length !== 1) {
        return res.result('没有该图书！')
    }

    const sqlCategorySel = 'select * from category2 where id = :id'
    const resCategorySel = await db.executeQuery(sqlCategorySel, { id: formDate.cid })
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
    return res.result('修改成功！', 0)
}

// 查询所有未删除的图书信息
exports.selOveryBooks = async (req, res) => {
    const formDate = req.query
    // page 是当前页码。
    // itemsPerPage 是每页显示的项目数量
    // 计算 offset(从哪一行开始返回数据)
    const offset = (formDate.page - 1) * formDate.itemsPerPage;
    //LIMIT 用于限制查询结果的行数。
    //OFFSET 用于指定从哪一行开始返回数据。
    const sql = `SELECT 
                    books.id,
                    books.cid,
                    books.uid,
                    books.aid,
                    books.name,
                    books.profile,
                    books.time,
                    books.edition,
                    books.price,
                    books.pages,
                    books.number,
                    books.topic,
                    books.popularity,
                    books.preview,
                    books.cover,
                    books.disable,
                    books.isdelete,
                    category2.name AS cValue,
                    category2.profile AS cProfile,
		            users.nickname AS uValue,
		            users.briefly AS uBriefly,
		            users.avatar AS uAvatar,
		            audit.nickname AS aValue,
                    users.briefly AS uBriefly
                    FROM 
                        books
                    LEFT JOIN 
                        category2 ON books.cid = category2.id
                    LEFT JOIN 
                        users ON books.uid = users.id
                    LEFT JOIN 
                        audit ON books.aid = audit.id
                    WHERE isdelete = 0
                    ORDER BY 
                        ${formDate.by} ${formDate.des}
		            LIMIT ${formDate.itemsPerPage} OFFSET ${offset}`
    const resSel = await db.executeQuery(sql);
    // 查询获取数据总数 
    const sqlCount = 'SELECT COUNT(*) AS count FROM books WHERE isdelete = 0'
    const resCount = await db.executeQuery(sqlCount)
    const count = resCount.data[0].count
    return res.result('图书获取成功！', 0, {
        value: resSel.data,
        count
    })
}

// 查询所有未删除的图书信息不分页
exports.selOveryNoPageBooks = async (req, res) => {
    const formDate = req.query
    // page 是当前页码。
    // itemsPerPage 是每页显示的项目数量
    // 计算 offset(从哪一行开始返回数据)
    const offset = (formDate.page - 1) * formDate.itemsPerPage;
    //LIMIT 用于限制查询结果的行数。
    //OFFSET 用于指定从哪一行开始返回数据。
    const sql = `SELECT 
                    books.id,
                    books.cid,
                    books.uid,
                    books.aid,
                    books.name,
                    books.profile,
                    books.time,
                    books.edition,
                    books.price,
                    books.pages,
                    books.number,
                    books.topic,
                    books.popularity,
                    books.preview,
                    books.cover,
                    books.disable,
                    books.isdelete,
                    category2.name AS cValue,
                    category2.profile AS cProfile,
		            users.nickname AS uValue,
		            users.briefly AS uBriefly,
		            users.avatar AS uAvatar,
		            audit.nickname AS aValue,
                    users.briefly AS uBriefly
                    FROM 
                        books
                    LEFT JOIN 
                        category2 ON books.cid = category2.id
                    LEFT JOIN 
                        users ON books.uid = users.id
                    LEFT JOIN 
                        audit ON books.aid = audit.id
                    WHERE isdelete = 0
                    ORDER BY 
                        ${formDate.by} ${formDate.des}`
    const resSel = await db.executeQuery(sql);
    // 查询获取数据总数 
    const sqlCount = 'SELECT COUNT(*) AS count FROM books WHERE isdelete = 0'
    const resCount = await db.executeQuery(sqlCount)
    const count = resCount.data[0].count
    return res.result('图书信息获取成功！', 0, {
        value: resSel.data,
        count
    })
}

// 查询所有图书信息
exports.selOveryEveryBooks = async (req, res) => {
    const formDate = req.query
    // page 是当前页码。
    // itemsPerPage 是每页显示的项目数量
    // 计算 offset(从哪一行开始返回数据)
    const offset = (formDate.page - 1) * formDate.itemsPerPage;
    //LIMIT 用于限制查询结果的行数。
    //OFFSET 用于指定从哪一行开始返回数据。
    const sql = `SELECT 
                    books.id,
                    books.cid,
                    books.uid,
                    books.aid,
                    books.name,
                    books.profile,
                    books.time,
                    books.edition,
                    books.price,
                    books.pages,
                    books.number,
                    books.topic,
                    books.popularity,
                    books.preview,
                    books.cover,
                    books.disable,
                    books.isdelete,
                    category2.name AS cValue,
                    category2.profile AS cProfile,
		            users.nickname AS uValue,
		            users.briefly AS uBriefly,
		            users.avatar AS uAvatar,
		            audit.nickname AS aValue,
                    users.briefly AS uBriefly
                    FROM 
                        books
                    LEFT JOIN 
                        category2 ON books.cid = category2.id
                    LEFT JOIN 
                        users ON books.uid = users.id
                    LEFT JOIN 
                        audit ON books.aid = audit.id
		            LIMIT ${formDate.itemsPerPage} OFFSET ${offset}`
    const resSel = await db.executeQuery(sql);
    // 查询获取数据总数 
    const sqlCount = 'SELECT COUNT(*) AS count FROM books'
    const resCount = await db.executeQuery(sqlCount)
    const count = resCount.data[0].count
    return res.result('获取成功！', 0, {
        value: resSel.data,
        count
    })
}

// 查询对应分类图书信息
exports.selCatergoryBooks = async (req, res) => {
    const formDate = req.query
    const sqlCategorySel = 'select * from category2 where id = :id'
    const resCategorySel = await db.executeQuery(sqlCategorySel, { id: formDate.cid })
    if (resCategorySel.data.length !== 1) {
        return res.result('未找到该分类！')
    }
    // page 是当前页码。
    // itemsPerPage 是每页显示的项目数量
    // 计算 offset(从哪一行开始返回数据)
    const offset = (formDate.page - 1) * formDate.itemsPerPage;
    //LIMIT 用于限制查询结果的行数。
    //OFFSET 用于指定从哪一行开始返回数据。
    const sql = `SELECT 
                    books.id,
                    books.cid,
                    books.uid,
                    books.aid,
                    books.name,
                    books.profile,
                    books.time,
                    books.edition,
                    books.price,
                    books.pages,
                    books.number,
                    books.topic,
                    books.popularity,
                    books.preview,
                    books.cover,
                    books.disable,
                    books.isdelete,
                    category2.name AS cValue,
                    category2.profile AS cProfile,
		            users.nickname AS uValue,
		            users.briefly AS uBriefly,
		            users.avatar AS uAvatar,
		            audit.nickname AS aValue,
                    users.briefly AS uBriefly
                    FROM 
                        books
                    LEFT JOIN 
                        category2 ON books.cid = category2.id
                    LEFT JOIN 
                        users ON books.uid = users.id
                    LEFT JOIN 
                        audit ON books.aid = audit.id
                    WHERE books.isdelete = 0 and books.cid = ${formDate.cid}
		            LIMIT ${formDate.itemsPerPage} OFFSET ${offset}`
    const resSel = await db.executeQuery(sql);
    // 查询获取数据总数 
    const sqlCount = 'SELECT COUNT(*) AS count FROM books where cid = :cid and isdelete = 0'
    const resCount = await db.executeQuery(sqlCount, { cid: formDate.cid })
    const count = resCount.data[0].count

    return res.result('获取成功！', 0, {
        value: resSel.data,
        count
    })
}

// 查询对应图书详情信息
exports.selInfoBooks = async (req, res) => {
    const formDate = req.query
    const sql = `SELECT 
                    books.id,
                    books.cid,
                    books.uid,
                    books.aid,
                    books.name,
                    books.profile,
                    books.time,
                    books.edition,
                    books.price,
                    books.pages,
                    books.number,
                    books.topic,
                    books.popularity,
                    books.preview,
                    books.cover,
                    books.disable,
                    books.isdelete,
                    category2.name AS cValue,
                    category2.profile AS cProfile,
		            users.nickname AS uValue,
		            users.briefly AS uBriefly,
		            users.avatar AS uAvatar,
		            audit.nickname AS aValue,
                    users.briefly AS uBriefly
                    FROM 
                        books
                    LEFT JOIN 
                        category2 ON books.cid = category2.id
                    LEFT JOIN 
                        users ON books.uid = users.id
                    LEFT JOIN 
                        audit ON books.aid = audit.id
                    WHERE books.isdelete = 0 AND books.id = ${formDate.id}`
    const resSel = await db.executeQuery(sql);
    if (resSel.data.length < 1) {
        return res.result('暂无图书信息')
    }
    return res.result('图书详细信息获取成功！', 0, resSel.data)
}

// 查询作者所有图书
exports.selUsersBooks = async (req,res) => {
    const { id } = req.query
    const sqlSelUser = `SELECT id
                    FROM users
                    WHERE id = :id AND isAuthor = 1`
    const resSelUser = await db.executeQuery(sqlSelUser,{id})
    if(resSelUser.data.length != 1){
        return res.result('未找到该作者')
    }
    const sql = `SELECT 
                    books.id,
                    books.cid,
                    books.uid,
                    books.aid,
                    books.name,
                    books.profile,
                    books.time,
                    books.edition,
                    books.price,
                    books.pages,
                    books.number,
                    books.topic,
                    books.popularity,
                    books.preview,
                    books.cover,
                    books.disable,
                    books.isdelete,
                    category2.name AS cValue,
                    category2.profile AS cProfile,
		            users.nickname AS uValue,
		            users.briefly AS uBriefly,
		            users.avatar AS uAvatar,
		            audit.nickname AS aValue,
                    users.briefly AS uBriefly
                    FROM books
                    LEFT JOIN 
                        category2 ON books.cid = category2.id
                    LEFT JOIN 
                        users ON books.uid = users.id
                    LEFT JOIN 
                        audit ON books.aid = audit.id
                    WHERE books.uid = :id and books.isdelete = 0
                    `
    const resSql = await db.executeQuery(sql,{id})
    const sqlCount = 'SELECT COUNT(*) AS count FROM books where uid = :id'
    const resCount = await db.executeQuery(sqlCount,{id})

    return res.result('获取作者图书成功！',0,{
        value:resSql.data,
        count:resCount.data
    })
}

// 查询作者所有图书无需传
exports.selUsersBooksUsers = async (req,res) => {
    const { id } = req.auth
    const sqlSelUser = `SELECT id
                    FROM users
                    WHERE id = :id AND isAuthor = 1`
    const resSelUser = await db.executeQuery(sqlSelUser,{id})
    if(resSelUser.data.length != 1){
        return res.result('未找到该作者')
    }
    const sql = `SELECT 
                    books.id,
                    books.cid,
                    books.uid,
                    books.aid,
                    books.name,
                    books.profile,
                    books.time,
                    books.edition,
                    books.price,
                    books.pages,
                    books.number,
                    books.topic,
                    books.popularity,
                    books.preview,
                    books.cover,
                    books.disable,
                    books.isdelete,
                    category2.name AS cValue,
                    category2.profile AS cProfile,
		            users.nickname AS uValue,
		            users.briefly AS uBriefly,
		            users.avatar AS uAvatar,
		            audit.nickname AS aValue,
                    users.briefly AS uBriefly
                    FROM books
                    LEFT JOIN 
                        category2 ON books.cid = category2.id
                    LEFT JOIN 
                        users ON books.uid = users.id
                    LEFT JOIN 
                        audit ON books.aid = audit.id
                    WHERE books.uid = :id and books.isdelete = 0
                    `
    const resSql = await db.executeQuery(sql,{id})
    const sqlCount = 'SELECT COUNT(*) AS count FROM books where uid = :id'
    const resCount = await db.executeQuery(sqlCount,{id})

    return res.result('获取作者图书成功！',0,{
        value:resSql.data,
        count:resCount.data
    })
}

// 搜索图书
exports.selBooksName = async (req,res) => {
    const { data,page,itemsPerPage } = req.query
    const offset = (page - 1) * itemsPerPage;
    const sql = `SELECT 
                    books.id,
                    books.cid,
                    books.uid,
                    books.aid,
                    books.name,
                    books.profile,
                    books.time,
                    books.edition,
                    books.price,
                    books.pages,
                    books.number,
                    books.topic,
                    books.popularity,
                    books.preview,
                    books.cover,
                    books.disable,
                    books.isdelete,
                    category2.name AS cValue,
                    category2.profile AS cProfile,
		            users.nickname AS uValue,
		            users.briefly AS uBriefly,
		            users.avatar AS uAvatar,
		            audit.nickname AS aValue,
                    users.briefly AS uBriefly
                    FROM 
                        books
                    LEFT JOIN 
                        category2 ON books.cid = category2.id
                    LEFT JOIN 
                        users ON books.uid = users.id
                    LEFT JOIN 
                        audit ON books.aid = audit.id
                    WHERE books.isdelete = 0 AND UPPER(books.name) LIKE UPPER('%${ data }%')
                    LIMIT ${itemsPerPage} OFFSET ${offset}`
    const resSel = await db.executeQuery(sql)
    const sqlCount = `SELECT COUNT(*) AS count FROM books WHERE books.isdelete = 0 AND UPPER(books.name) LIKE UPPER('%${ data }%')`
    const resCount = await db.executeQuery(sqlCount)
    const count = resCount.data[0]
    return res.result('搜素成功！', 0, {
        value: resSel.data,
        ...count
    })
}