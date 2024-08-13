const mysql = require('mysql2/promise')

const pool = mysql.createPool({
    host: '127.0.0.1',
    port: 3305,
    user: 'root',
    password: '123456',
    database: 'books',
    namedPlaceholders: true
})

// 定义执行SQL语句的异步函数
const executeQuery = async (sql, params) => {
    const connection = await pool.getConnection();
    try {
        const [rows] = await connection.execute(sql, params);
        const response = {
            status: 0,
            message: '操作成功',
            data: rows
        };
        return response;
    } catch (error) {
        const response = {
            status: 1,
            message: `发送错误: ${error.message}`,
            data: null
        };
        console.error('Error executing SQL:', error);
        throw response; // 或者 return response 如果你不希望抛出错误
    } finally {
        connection.release();
    }
};

// 导出executeQuery函数
module.exports = {
    executeQuery
};