import fs from "fs";
import csv from "csv-parser";
import axios from "axios";

function readCSVAndFetchData(filename = "../categories.csv") {
    let paths = [];


    fs.createReadStream(filename)
        .pipe(csv()) // 解析 CSV
        .on("data", (row) => {
            if (row.path) {
                paths.push(row.path); // 提取 path 字段
            }
        })
        .on("end", async () => {
            // console.log("所有 path 数据:", paths);
            await fetchData(paths); // 发送请求
        });
}
async function fetchData(paths) {
    const baseUrl = "https://www.quanben.io"; // 替换成你的目标网站
    var headers = {
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
        'Accept-Language': 'zh-CN,zh;q=0.9',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        'Pragma': 'no-cache',
        'Sec-Fetch-Dest': 'document',
        'Sec-Fetch-Mode': 'navigate',
        'Sec-Fetch-Site': 'none',
        'Sec-Fetch-User': '?1',
        'Upgrade-Insecure-Requests': '1',
        'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1',
        'Cookie': '_ga=GA1.2.796885527.1732002615; _im_vid=01JD1PDCDGTFA01Z7Z14CZMKJW; _ga_PJ0N20S6JN=GS1.2.1732193647.5.1.1732194092.60.0.0'
    };
    let results = []; // 存储 path 和 value 的数组

    const requests = paths.map(async (path) => {
        try {
            // console.log(`正在请求: ${baseUrl + path}`);
            const response = await axios.get(baseUrl + path, {
                headers: {
                    ...headers
                }
            });
            // console.log(`数据获取成功: ${path}`);
            let start = response.data.indexOf(`<span class="cur_page">`);
            let end = response.data.indexOf(`</span>`, start);
            let result = response.data.substring(start, end) // 只打印部分内容，避免太长
            let afterSlash = result.split("/").pop(); // 获取最后一部分
            // console.log(afterSlash);
            results.push({ path: path, value: afterSlash });
        } catch (error) {
            console.error(`请求失败: ${path}`, error.message);
        }
    });

    await Promise.all(requests);
    // console.log("所有数据:", results);
    saveToCSV(results);
    console.log("所有请求已完成！");
}
function saveToCSV(results, filename = "count.csv") {
    let csvContent = "path,value\n"; // CSV 头部
    results.forEach(item => {
        csvContent += `${item.path},${item.value}\n`;
    });

    fs.writeFileSync(filename, csvContent, "utf8");
    console.log(`CSV 文件已保存: ${filename}`);
}

// 运行
readCSVAndFetchData();
