// 路由处理模块
//导入数据库模块
const db = require('../db/index')

//添加二级分类处理模块
exports.add = async (req, res) => {
    const formData = req.body
    const sqlSel = 'select * from category where id = :id'
    const resSel = await db.executeQuery(sqlSel, { id: formData.cid })
    if (resSel.data.length !== 1) {
        return res.result('未找到对应一级分类！')
    }

    const sqlSelTwo = 'select * from category2 where name = :name'
    const resSelTwo = await db.executeQuery(sqlSelTwo, { name: formData.name })
    if (resSelTwo.data.length >= 1) {
        return res.result('该分类名已存在')
    }

    const sql = 'INSERT INTO category2 (name, profile,cid,cover) VALUES (:name, :profile,:cid,:cover)';
    const resAdd = await db.executeQuery(sql, { name: formData.name, profile: formData.profile, cid: formData.cid, cover: formData.cover })
    return res.result('添加成功！', 0)
}


//删除二级分类（分类认为非重要数据实现删除操作）
exports.delete = async (req, res) => {
    const sqlSel = 'select * from category2 where id = :id'
    const resSel = await db.executeQuery(sqlSel, { id: req.query.id })
    if (resSel.data.length !== 1) {
        return res.result('未找到该分类！')
    }
    const sql = 'DELETE FROM category2 WHERE id = :id'
    const resDel = await db.executeQuery(sql, { id: req.query.id })

    const sqlBookSel = 'UPDATE books SET cid=NULL WHERE cid = :cid'
    const resBookSel = await db.executeQuery(sqlBookSel, { cid: req.query.id })

    return res.result('删除成功!', 0)
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
    const sql = `SELECT 
                    category2.id,
                    category2.name,
                    category2.profile,
                    category2.cid,
                    category2.cover,
                    category.name AS cValue
                    FROM 
                        category2
                    LEFT JOIN 
                        category ON category2.cid = category.id
		            LIMIT ${formDate.itemsPerPage} OFFSET ${offset}`
    const resSel = await db.executeQuery(sql, { cid: formDate.cid });
    // 查询获取数据总数 
    const sqlCount = 'SELECT COUNT(*) AS count FROM category2'
    const resCount = await db.executeQuery(sqlCount, { cid: formDate.cid })
    const count = resCount.data[0].count

    // 返回结果
    return res.result('二级分类获取成功！', 0, {
        value: resSel.data,
        count
    })
}

// 查询二级分类名列表
exports.selName = async (req, res) => {
    const sql = `SELECT id,name FROM category2`
    const resSel = await db.executeQuery(sql);
    if (resSel.data.length < 1) {
        return res.result('暂无分类信息')
    }
    // 返回结果
    return res.result('获取成功！', 0, resSel.data)
}


//更新二级分类
exports.upData = async (req, res) => {
    const { name, profile, cid, cover, id } = req.body
    const sqlSel = 'select * from category2 where id = :id'
    const resSel = await db.executeQuery(sqlSel, { id })
    if (resSel.data.length !== 1) {
        return res.result('未找到该分类！')
    }
    const sqlUp = 'UPDATE category2 SET name = :name,profile = :profile,cid = :cid,cover = :cover WHERE id = :id'
    const resUp = await db.executeQuery(sqlUp, { name, profile, cid, cover, id })
    return res.result('更新成功！', 0)
}
// 获取二级分类详细信息
exports.getInfo = async (req, res) => {
    const formData = req.query
    const sqlSel = 'select * from category2 where id = :id'
    const resSel = await db.executeQuery(sqlSel, { id: formData.id })
    if (resSel.data.length !== 1) {
        return res.result('未找到该分类！')
    }
    return res.result('查询成功！', 0, resSel.data)
}



exports.categoryOvery = async (req, res) => {
    const sql = `SELECT category.id,category.name, GROUP_CONCAT(category2.id) as cid,GROUP_CONCAT(category2.name) as cids
                 FROM category
                 LEFT JOIN category2 ON category.id = category2.cid
                 GROUP BY category.id;`
    const resSql = await db.executeQuery(sql)
    const transformedData = resSql.data.map(item => {
        const cidsArray = item.cids.split(',');
        const cidArray = item.cid.split(',');
        const children = cidsArray.map((cname, index) => ({
            value: parseInt(cidArray[index], 10),
            label: cname.trim()
        }));
        return {
            value: item.id,
            label: item.name,
            children: children
        };
    });
    res.result('分类信息获取成功', 0, transformedData)
}

// 查询人气最高的分类
exports.popularCategories = async (req,res) => {
    const sql = `SELECT category2.id, category2.name, SUM(books.popularity) as total_popularity
                    FROM category2
                    LEFT JOIN books ON category2.id = books.cid
                    GROUP BY category2.id, category2.name
                    ORDER BY total_popularity DESC;`
    const resSql = await db.executeQuery(sql)
    res.result('热门分类获取成功',0,resSql.data)
}