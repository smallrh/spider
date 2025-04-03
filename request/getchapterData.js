
import request from 'request';
import { fetchPage } from "./fatchdata.js";
import {insertIntoChapter} from '../orm/insertIntoChapter.js';


// 通用请求头
const headers = {
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
    'Accept-Language': 'zh-CN,zh;q=0.9',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
    'Pragma': 'no-cache',
    'Referer': 'www.quanben.io',
    'Sec-Fetch-Dest': 'document',
    'Sec-Fetch-Mode': 'navigate',
    'Sec-Fetch-Site': 'same-origin',
    'Sec-Fetch-User': '?1',
    'Upgrade-Insecure-Requests': '1',
    'User-Agent': 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Mobile Safari/537.36',
    'sec-ch-ua': '"Chromium";v="134", "Not:A-Brand";v="24", "Google Chrome";v="134"',
    'sec-ch-ua-mobile': '?1',
    'sec-ch-ua-platform': '"Android"',
    'Cookie': '_ga=GA1.2.796885527.1732002615; _im_vid=01JD1PDCDGTFA01Z7Z14CZMKJW; _gid=GA1.2.597772409.1743336339; _ga_PJ0N20S6JN=GS1.2.1743336341.6.0.1743336341.60.0.0'
};

async function getChapterData(url, maxRetries = 3, retryDelay = 2000) {
    let attempt = 0;

    while (attempt < maxRetries) {
        try {
            return await new Promise((resolve, reject) => {
                const options = { url, headers };

                request(options, async (error, response, body) => {
                    if (error) {
                        console.error(`❌ 请求失败 (尝试 ${attempt + 1}/${maxRetries}): ${url}, 错误: ${error.message}`);
                        return reject(error);
                    }

                    if (response.statusCode !== 200) {
                        console.error(`⚠️ 请求失败 (尝试 ${attempt + 1}/${maxRetries}): ${url}, 状态码: ${response.statusCode}`);
                        return reject(new Error(`HTTP ${response.statusCode}`));
                    }

                    console.log(`✅ 爬取成功: ${url}`);
                    resolve(body);
                });
            });
        } catch (err) {
            attempt++;
            if (attempt < maxRetries) {
                console.log(`🔄 重试 ${attempt}/${maxRetries}，等待 ${retryDelay / 1000} 秒...`);
                await new Promise(res => setTimeout(res, retryDelay));
            } else {
                console.error(`🚨 最终失败: ${url}, 错误: ${err.message}`);
                throw err;
            }
        }
    }
}

async function getcount(html) {
    // 找到所有 <li itemprop="itemListElement"> 的索引
    let listItems = html.split('<li itemprop="itemListElement">');

    if (listItems.length < 2) {
        console.error("未找到章节列表");
        return null;
    }

    // 取最后一个 <li>，并找到其中的 <a href="..."> 链接
    let lastItem = listItems[listItems.length - 1];

    // 提取 href="..." 部分
    let hrefMatch = lastItem.match(/href="([^"]+)"/);
    if (!hrefMatch) {
        console.error("未找到最后一章的链接");
        return null;
    }

    let href = hrefMatch[1]; // 例如： /n/laobingchuanqi/2459.html

    // 使用 split 和 slice 提取章节编号
    let parts = href.split("/");
    let lastPart = parts[parts.length - 1]; // "2459.html"

    let count = lastPart.split(".")[0]; // 提取 "2459"

    console.log("最后章节编号:", count);
    return count;
}

// 定义异步函数
export async function fetchChapters(returnres1) {
    for (let item of returnres1) {
        try {
            const res = await getChapterData(item.url); // 获取章节 HTML
            const count = await getcount(res); // 解析最后章节编号
            item.count = count; // 添加 count 到对象中
        } catch (error) {
            console.error(`获取章节失败: ${item.url}`, error);
            item.count = null; // 避免报错
        }
    }
    return returnres1;
    // console.log(returnres1);
}

// // 调用函数
// const res = await fetchChapters(returnres1);
// console.log(res);
// await executeTasksOfChapters(res);

// 任务调度逻辑
export async function executeTasksOfChapters(list) {
    try {
        console.log("开始任务调度...");

        // 并发爬取任务，限制最大并发数
        const concurrencyLimit = 5;
        const taskQueue = [];

        for (let i = 0; i < list.length; i++) {
            taskQueue.push(getPage(list[i]));

            if (taskQueue.length >= concurrencyLimit) {
                await Promise.all(taskQueue);
                taskQueue.length = 0; // 清空任务队列
            }
        }

        // 处理剩余任务
        if (taskQueue.length > 0) {
            await Promise.all(taskQueue);
        }

        console.log("所有任务完成！");
    } catch (error) {
        console.error("任务执行失败:", error);
    }
}
async function getPage(item) {
    try {
        for (let i = 0; i < item.count; i++) {
            const correctedUrl = item.url.replace("list.html", "") + `${i + 1}.html`;
            console.log(correctedUrl);
            const res = await fetchPage(correctedUrl);
            const { title, content } =  parseTitleAndPage(res)
            // console.log(title);
            // console.log(content);
            // let result = await insertIntoChapter(item, res)
            // console.log(res);
            const result = await insertIntoChapter(item, i + 1, title, content )
            console.log(result);

        }
    } catch (error) {
        console.error(`获取章节失败: ${item.url}`, error);
        item.count = null; // 避免报错
    }
}
function parseTitleAndPage(html) {
    // console.log(html);
    try {
        // 提取章节标题
        const titleMatch = html.match(/<h1 class="headline" itemprop="headline">(.*?)<\/h1>/);
        const title = titleMatch ? titleMatch[1].trim() : "";

        const startMarker = "</script></div>"; // 起始标记
        const startIndex = html.indexOf(startMarker);
        if (startIndex === -1) throw new Error("未找到起始标记");

        // 定位结束位置（`</p><div` 之前）
        const endMarker = "</p><div";
        const endIndex = html.indexOf(endMarker, startIndex);
        if (endIndex === -1) throw new Error("未找到结束标记");

        // 提取中间内容
        let content = html.slice(startIndex + startMarker.length, endIndex);

        // 处理文本，去掉HTML标签
        content = content
            .replace(/<\/?[^>]+(>|$)/g, "") // 移除所有HTML标签
            .replace(/\n+/g, "\n") // 规范换行
            .trim();

        return { title, content };
    } catch (error) {
        console.error("解析 HTML 失败:", error);
        return { title: "", content: "" };
    }
}


