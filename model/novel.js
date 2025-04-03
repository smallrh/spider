import { getIndex } from '../utils/getIndexByValue.js';

export class Novel {
    constructor(title, author, description, url, image, divid, status, catagry_id) {
        this.title = title;
        this.author = author;
        this.description = description;
        this.url = url;
        this.image = image;
        this.divid = divid; // 分类名称
        this.status = status;
        this.catagry_id = catagry_id; // 需要异步获取
    }

    /**
     * 异步创建 Novel 实例，确保 catagry_id 正确
     * @param {string} title
     * @param {string} author
     * @param {string} description
     * @param {string} url
     * @param {string} image
     * @param {string} divid
     * @param {string} status
     * @returns {Promise<Novel>}
     */
    static async create(title, author, description, url, image, divid, status) {
        const catagry_id = await getIndex(divid);
        return new Novel(title, author, description, url, image, divid, status, catagry_id);
    }
}
