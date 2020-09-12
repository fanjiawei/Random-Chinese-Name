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


