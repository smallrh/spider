import { insert } from "../orm/insertnovelstoMysql.js";
import { fetchPage } from "./fatchdata.js";
import { fetchChapters } from "./getchapterData.js";
import { getData } from "./getdata.js";
import { fetchData } from "./getdata.js";

import {insertIntoChapter} from "../orm/insertIntoChapter.js"
// [
//     "https://www.quanben.io//n/laobingchuanqi/",
//     "https://www.quanben.io//n/fengliuxianggongximenqing/",
//     "https://www.quanben.io//n/xiaoyuanquannenggaoshou/",
//     "https://www.quanben.io//n/toushizhiyan/",
//     "https://www.quanben.io//n/guantu/",
//     "https://www.quanben.io//n/chaojixiuzhenbaobiao/",
//     "https://www.quanben.io//n/heidaotezhongbing/",
//     "https://www.quanben.io//n/xiuxiangaoshouzaixiaoyuan/",
//     "https://www.quanben.io//n/yidaoshengxiang/",
//     "https://www.quanben.io//n/dushiquannengxitong/",
//     "https://www.quanben.io//n/chengshen/",
//     "https://www.quanben.io//n/tiancaiyisheng/",
//   ]

const list = [
    "https://www.quanben.io//n/laobingchuanqi/",
    "https://www.quanben.io//n/fengliuxianggongximenqing/",
    "https://www.quanben.io//n/xiaoyuanquannenggaoshou/",
    "https://www.quanben.io//n/toushizhiyan/",
    "https://www.quanben.io//n/guantu/",
    "https://www.quanben.io//n/chaojixiuzhenbaobiao/",
    "https://www.quanben.io//n/heidaotezhongbing/",
    "https://www.quanben.io//n/xiuxiangaoshouzaixiaoyuan/",
    "https://www.quanben.io//n/yidaoshengxiang/",
    "https://www.quanben.io//n/dushiquannengxitong/",
    "https://www.quanben.io//n/chengshen/",
    "https://www.quanben.io//n/tiancaiyisheng/",
]
//该部分已经测试完成
// const res = await getData(list);
// console.log(res);
// const returnres = await insert(res)
//这是返回值
const returnres1 = [
    {
        id: 1,
        url: "https://www.quanben.io/n/laobingchuanqi/list.html",
    },
    {
        id: 2,
        url: "https://www.quanben.io/n/toushizhiyan/list.html",
    },
    {
        id: 3,
        url: "https://www.quanben.io/n/guantu/list.html",
    },
    {
        id: 4,
        url: "https://www.quanben.io/n/fengliuxianggongximenqing/list.html",
    },
    {
        id: 5,
        url: "https://www.quanben.io/n/xiaoyuanquannenggaoshou/list.html",
    },
    {
        id: 6,
        url: "https://www.quanben.io/n/chaojixiuzhenbaobiao/list.html",
    },
    {
        id: 7,
        url: "https://www.quanben.io/n/heidaotezhongbing/list.html",
    },
    {
        id: 8,
        url: "https://www.quanben.io/n/yidaoshengxiang/list.html",
    },
    {
        id: 9,
        url: "https://www.quanben.io/n/xiuxiangaoshouzaixiaoyuan/list.html",
    },
    {
        id: 10,
        url: "https://www.quanben.io/n/dushiquannengxitong/list.html",
    },
    {
        id: 11,
        url: "https://www.quanben.io/n/chengshen/list.html",
    },
    {
        id: 12,
        url: "https://www.quanben.io/n/tiancaiyisheng/list.html",
    },
]





// console.log(returnres);
// await fetchData("https://www.quanben.io/c/dushi_98.html");