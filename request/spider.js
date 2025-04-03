import fs from "fs";
import csv from "csv-parser";
import { fetchPage } from './fatchdata.js';  // 使用 import
import { parseNovels } from './parsenovels.js';
import { getData } from './getdata.js';
import { insert } from '../orm/insertnovelstoMysql.js';
import { fetchChapters } from './getchapterData.js';
import { executeTasksOfChapters } from './getchapterData.js';
import { setTimeout } from "timers/promises";



// 读取 CSV 并生成任务列表
function readCSVAndGenerateUrls(filename = "../count.csv") {
    let tasks = [];

    return new Promise((resolve, reject) => {
        fs.createReadStream(filename)
            .pipe(csv()) // 解析 CSV
            .on("data", (row) => {
                if (row.path && row.value) {
                    let count = Math.ceil(Number(row.value)); // 计算总页数
                    let basePath = row.path.replace(".html", ""); // 处理路径
                    let urls = generateUrls(basePath, count); // 生成 URL 列表
                    tasks.push(...urls);
                }
            })
            .on("end", () => {
                console.log("所有任务已加载:", tasks.length, "个 URL");
                resolve(tasks);
            })
            .on("error", (error) => reject(error));
    });
}

// 生成 URL 列表
function generateUrls(basePath, count) {
    let urls = [];
    for (let i = 1; i <= count; i++) {
        urls.push(`https://www.quanben.io${basePath}_${i}.html`);
    }
    return urls;
}


const MAX_CONCURRENT_REQUESTS = 10; // 最大并发数
const RETRY_LIMIT = 3; // 失败重试次数

async function executeTasks() {
    try {
        const urls = await readCSVAndGenerateUrls();
        console.log(`📌 需要爬取 ${urls.length} 个页面...`);

        let completed = 0;
        const queue = [...urls]; // 任务队列
        const activeTasks = new Set(); // 存储当前活跃任务

        async function worker() {
            while (queue.length > 0) {
                const url = queue.shift();
                const task = crawlWithRetry(url, RETRY_LIMIT)
                    .catch(err => console.error(`❌ 任务失败: ${url}, 错误: ${err.message}`))
                    .finally(() => {
                        activeTasks.delete(task);
                        completed++;
                        if (completed % 100 === 0) {
                            console.log(`📊 进度: ${completed}/${urls.length}`);
                        }
                    });

                activeTasks.add(task);

                if (activeTasks.size >= MAX_CONCURRENT_REQUESTS) {
                    await Promise.race(activeTasks); // 等待最早完成的任务
                }
            }
        }

        // 启动 10 个 worker
        await Promise.all(Array.from({ length: MAX_CONCURRENT_REQUESTS }, worker));

        console.log(`✅ 所有任务完成！总共爬取: ${completed}/${urls.length}`);
    } catch (error) {
        console.error("❌ 任务执行失败:", error);
    }
}

// 失败自动重试的爬取方法
async function crawlWithRetry(url, retries) {
    for (let attempt = 1; attempt <= retries; attempt++) {
        try {
            return await crawlPage(url);
        } catch (error) {
            console.warn(`⚠️ [${attempt}/${retries}] ${url} 请求失败, 错误: ${error.message}`);
            if (attempt < retries) {
                await setTimeout(1000 * attempt); // 指数级退避延迟（1s, 2s, 3s...）
            } else {
                throw error;
            }
        }
    }
}



// 爬取页面（模拟真实网络请求）
async function crawlPage(url) {
    try {
        //现在测试使用某一个页面的数据
        const html = await fetchPage(url);
        // console.log("页面内容长度:", html.length);
        // console.log(html)
        const lists = parseNovels(html);
        console.log(lists)
        const chapterUrls = await getData(lists);
        console.log(chapterUrls)
        const returnres = await insert(chapterUrls)
        const res = await fetchChapters(returnres);
        console.log(res);
        await executeTasksOfChapters(res);
    }
    catch (error) {
        console.error("页面抓取失败:", error);
    }
}

// 立即执行一次任务
executeTasks();
