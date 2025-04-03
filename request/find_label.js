import request from 'request';
import fs from 'fs';

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

var options = {
    url: 'https://www.quanben.io/',
    headers: headers
};

function callback(error, response, body) {
    if (!error && response.statusCode == 200) {
        let start = body.indexOf(`<div class="nav" itemscope="itemscope" itemtype="http://schema.org/SiteNavigationElement">`);
        let end = body.indexOf(`<div class="box search">`);
        if (start !== -1 && end !== -1) {
            let navContent = body.substring(start, end).trim(); // 截取导航栏部分

            let regex = /<a href="(\/c\/.*?)" itemprop="url"><span itemprop="name">(.*?)<\/span><\/a>/g;
            let match;
            let results = [];

            while ((match = regex.exec(navContent)) !== null) {
                results.push({ path: match[1], value: match[2] });
            }

            console.log(results);
            saveToCSV(results);
        }
    }
}
function saveToCSV(results, filename = "categories.csv") {
    let csvContent = "path,value\n"; // CSV 头部
    results.forEach(item => {
        csvContent += `${item.path},${item.value}\n`;
    });

    fs.writeFileSync(filename, csvContent, "utf8");
    console.log(`CSV 文件已保存: ${filename}`);
}


request(options, callback);
