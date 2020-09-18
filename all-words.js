const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
/**
 * 遍历 unicode 编码获取所有的汉字
 */

let chars = '';
//u4e00-u9fa5
for (let i = parseInt('4e00', 16); i <= parseInt('9fa5', 16); i++) {
    chars = chars + String.fromCharCode(i);
}

//0x3400, 0x4DB5
for (let i = parseInt('3400', 16); i <= parseInt('4DB5', 16); i++) {
    chars = chars + String.fromCharCode(i);
}

/**
 * 捡出吉字
 */
    //let second = 0;
    //for (let i = 0; i < chars.length; i++) {
    //    const char = chars.charAt(i);
    //    fs.access(`./pages/${char}.html`, fs.constants.F_OK, (err) => {
    //        if (!err) {
    //            console.log(`『${char}』已存在，无需下载`);
    //            return;
    //        }
    //        setTimeout(() => {
    //            axios.get(`http://tool.httpcn.com/KangXi/So.asp?Tid=1&wd=${encodeURIComponent(char)}`).then(res => res.data).then(res => {
    //                //const $ = cheerio.load(res);
    //                //if ($('#div_a1').length) {
    //                //
    //                //}
    //                fs.writeFileSync(`./pages/${char}.html`, res);
    //                console.log(`${char}下载成功`);
    //            });
    //        }, 1000 * second++);
    //    });
    //}


