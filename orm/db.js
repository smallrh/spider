import mysql from 'mysql2/promise';

// 配置数据库连接
const dbConfig = {
    host: '127.0.0.1', // 不能把端口写在 host 里
    port: 3306, // 这里单独指定端口
    user: 'root',
    password: '123123',
    database: 'smoothbook',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
};

// 创建数据库连接池
export const pool = mysql.createPool(dbConfig);
