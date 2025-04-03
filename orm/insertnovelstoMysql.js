import { pool } from './db.js';

export async function insert(novels) {
    const connection = await pool.getConnection();
    try {
        // 开始事务
        await connection.beginTransaction();

        const sql = `INSERT INTO novels (title, author, category_id, cover, description, status, word_count) 
                     VALUES (?, ?, ?, ?, ?, ?, ?)`;

        const results = [];

        for (const novel of novels) {
            const [result] = await connection.execute(sql, [
                novel.title,
                novel.author,
                novel.catagry_id, // 修正 category_id
                novel.image, // 修正 cover 存储
                novel.description,
                novel.status,
                0 // 默认 word_count 为 0
            ]);
            results.push({ id: result.insertId, url: "https://www.quanben.io" + novel.url });
        }

        // 提交事务
        await connection.commit();
        return results;
    } catch (error) {
        // 发生错误，回滚事务
        await connection.rollback();
        console.error('数据库插入失败，已回滚:', error);
        throw error;
    } finally {
        connection.release();
    }
}
