import { pool } from './db.js';

export async function insertIntoChapter(item,index, title, content) {
    let connection = null;
    try {
        connection = await pool.getConnection();
        // 开始事务
        await connection.beginTransaction();

        const sql = `INSERT INTO chapters (novel_id, title, content, chapter_number) 
                     VALUES (?, ?, ?, ?)`;

        const [result] = await connection.execute(sql, [
            item.id,
            title,
            content,
            index
        ]);
        
        console.log('插入成功:', result);
        
        // 提交事务
        await connection.commit();
        return result;
    } catch (error) {
        // 发生错误，回滚事务
        if (connection) await connection.rollback();
        console.error('数据库插入失败，已回滚:', error);
        throw new Error(`数据库插入失败: ${error.message}`);
    } finally {
        if (connection) connection.release();
    }
}