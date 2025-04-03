import request from "request";

// 通用请求头
const headers = {
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
    "Accept-Language": "zh-CN,zh;q=0.9",
    "Cache-Control": "no-cache",
    "Connection": "keep-alive",
    "Pragma": "no-cache",
    "Sec-Fetch-Dest": "document",
    "Sec-Fetch-Mode": "navigate",
    "Sec-Fetch-Site": "none",
    "Sec-Fetch-User": "?1",
    "Upgrade-Insecure-Requests": "1",
    "User-Agent": "Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Mobile Safari/537.36",
    "sec-ch-ua": `"Chromium";v="134", "Not:A-Brand";v="24", "Google Chrome";v="134"`,
    "sec-ch-ua-mobile": "?1",
    "sec-ch-ua-platform": `"Android"`,
    "Cookie": "_ga=GA1.2.796885527.1732002615; _im_vid=01JD1PDCDGTFA01Z7Z14CZMKJW; _gid=GA1.2.597772409.1743336339; _ga_PJ0N20S6JN=GS1.2.1743336341.6.0.1743336341.60.0.0"
};

/**
 * 爬取指定页面
 * @param {string} url 目标页面的 URL
 * @returns {Promise<string>} 页面内容
 */
export async function fetchPage(url, maxRetries = 3, retryDelay = 2000) {
    let attempt = 0;

    while (attempt < maxRetries) {
        try {
            return await new Promise((resolve, reject) => {
                const options = { url, headers };

                request(options, (error, response, body) => {
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

