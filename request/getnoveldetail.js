import { Novel } from "../model/novel.js";
export async function  parseNovels(html) {
    
    // 获取标题
    const titleMatch = html.match(/<h1 itemprop="name headline">(.*?)<\/h1>/);
    const title = titleMatch ? titleMatch[1].trim() : "";
    
    // 获取作者
    const authorMatch = html.match(/<p>作者: <span itemprop="author">(.*?)<\/span><\/p>/);
    const author = authorMatch ? authorMatch[1].trim() : "";
    
    // 获取简介
    const descriptionMatch = html.match(/<div class="description" itemprop="description">\s*<p>(.*?)<\/p>/);
    const description = descriptionMatch ? descriptionMatch[1].trim() : "";
    
    // 获取封面图片
    const imageMatch = html.match(/<img src="(.*?)" alt="/);
    const image = imageMatch ? imageMatch[1].trim() : "";
    
    // 获取小说 URL
    const urlMatch = html.match(/<a href="(.*?)" class="button s1" itemprop="url">点击阅读<\/a>/);
    const url = urlMatch ? urlMatch[1].trim() : "";
    
    // 获取分类
    const dividMatch = html.match(/<a href="\/c\/(.*?)\.html">/);
    const divid = dividMatch ? dividMatch[1].trim() : "";
    
    // 获取状态
    const statusMatch = html.match(/<p>状态: <span>(.*?)<\/span><\/p>/);
    const status = statusMatch ? statusMatch[1].trim() : "";
    
    return await Novel.create(title, author, description, url, image, divid, status);
}
