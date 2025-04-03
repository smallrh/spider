import request from 'request';
import pLimit from 'p-limit';
import { parseNovels } from './getnoveldetail.js';

export async function getData(urls, concurrency = 5) {
    // 创建一个并发限制器
    const limit = pLimit(concurrency);
    let chapterUrls = [];

    // 生成带有并发控制的请求任务
    const tasks = urls.map(url => limit(async () => {
        try {
            const data = await fetchData(url);
            chapterUrls.push(data);
        } catch (error) {
            return { error: error.message, url };
        }
    }));

    // 等待所有任务完成
    await Promise.allSettled(tasks);

    // 返回 chapterUrls
    return chapterUrls;
}
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
export async function fetchData(url, maxRetries = 3, retryDelay = 2000) {
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
                    const novel = await parseNovels(body);
                    resolve(novel);
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
