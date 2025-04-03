import fs from 'fs';
import path from 'path';
import csv from 'csv-parser';

const categoryMap = new Map();
let isCategoriesLoaded = false; // 避免重复加载

/**
 * 读取 categories.csv 并解析数据
 */
export async function loadCategories() {
    if (isCategoriesLoaded) return;

    return new Promise((resolve, reject) => {
        const filePath = path.join(process.cwd(), '../categories.csv');

        fs.createReadStream(filePath)
            .pipe(csv())
            .on('data', (row) => {
                if (!row.path || !row.index) return;

                const key = row.path.replace('/c/', '').replace('.html', ''); // 提取分类名称，如 "xuanhuan"
                categoryMap.set(key, Number(row.index)); // 存入 Map
            })
            .on('end', () => {
                isCategoriesLoaded = true;
                console.log('✅ categories.csv 加载完成:', categoryMap.size, '个分类');
                resolve();
            })
            .on('error', (error) => reject(error));
    });
}

/**
 * 根据分类名称获取 index
 * @param {string} value 分类名称（如 "xuanhuan"）
 * @returns {number} 分类 ID（index）
 */
export function parseDividToId(value) {
    return categoryMap.get(value) ?? -1;
}

/**
 * 获取分类 index（如果未加载会自动加载 categories.csv）
 * @param {string} value 分类名称
 * @returns {Promise<number>} 分类 ID（index）
 */
export async function getIndex(value) {
    if (!isCategoriesLoaded) await loadCategories();
    return parseDividToId(value);
}
