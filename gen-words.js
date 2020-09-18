const path = require('path');
const pinyin = require('pinyin');
const fs = require('fs');
const axios = require('axios');
const cheerio = require('cheerio');

const TONE = [
    ['ā', 'ō', 'ē', 'ī', 'ū', 'ǖ'],
    ['á', 'ó', 'é', 'í', 'ú', 'ǘ', 'ń'],
    ['ǎ', 'ǒ', 'ě', 'ǐ', 'ǔ', 'ǚ', 'ň'],
    ['à', 'ò', 'è', 'ì', 'ù', 'ǜ']
];

function getToneType(word) {
    let wordPinyin = pinyin(word)[0][0];
    for (let index = 0; index < TONE.length; index++) {
        let i = TONE[index];
        if (i.some(j => wordPinyin.indexOf(j) > -1)) {
            return index;
        }
    }
}

let usefulChars = [];
(async function(path) {
    try {
        const fileNames = await fs.promises.readdir('./pages');
        console.log('开始遍历处理每个文字');
        const chars = await Promise.all(fileNames.map(i => {
            return fs.promises.readFile(`./pages/${i}`).then(file => {
                const result = {};
                const content = file.toLocaleString();
                if (content.indexOf('很抱歉，您查询的结果不存在') > -1) {
                    return null;
                }
                if (content.indexOf('吉凶寓意：吉') === -1) {
                    return null;
                }
                cheerio(content);
                const $ = cheerio.load(content);
                result.char = i.replace('.html', '');
                const allSpanB = $('span.b');
                let jiantiziSpan = allSpanB.filter((idx, i) => $(i).text() === '简体字：');
                if (jiantiziSpan.length) {
                    result.char = jiantiziSpan.next().text();
                }

                let pinYinSpan = allSpanB.filter((idx, i) => $(i).text() === '拼音：');
                if (pinYinSpan.length) {
                    result.pinYin = pinYinSpan.next().text();
                } else {
                    console.log(result.char + '找不到拼音');
                }

                result.wuxin = content.match(/汉字五行：(.)/)[1];
                return result;
            });
        }));
        console.log('处理完毕');

        let words = [
            [], [], [], [], []
        ];
        new Set(chars.filter(i => Boolean(i))).forEach((item) => {
            let toneType = getToneType(item.char);
            if (!Number.isInteger(toneType)) { //生僻字无法获取声调，暂且放到 words 的第5个数组里
                words[4].push(item.char);
                return;
            }
            words[toneType].push(item.char);
        });

        console.log('按拼音组织的文字写入文件./words.json');
        fs.writeFile('./words.json', JSON.stringify(words), () => null);

        console.log('文字五行写入文件./src/result.json');
        fs.writeFile('./src/result.json', JSON.stringify(chars.filter(i => Boolean(i)).reduce((preValue, item) => {
            preValue[item.char] = item.wuxin;
            return preValue;
        }, {})), () => null);
    } catch (error) {
        console.error('there was an error:', error.message);
    }
})('./pages');


