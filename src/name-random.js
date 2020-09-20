import flat from 'lodash-es/flatten';
import flattenDeep from 'lodash-es/flattenDeep';
import reduce from 'lodash-es/reduce';
import some from 'lodash-es/some';
import uniq from 'lodash-es/uniq';
import pinyin from 'pinyin';
import wordWuxing from './result';
import toneWords from './words';

const TONE = [
    ['ā', 'ō', 'ē', 'ī', 'ū', 'ǖ'],
    ['á', 'ó', 'é', 'í', 'ú', 'ǘ', 'ń'],
    ['ǎ', 'ǒ', 'ě', 'ǐ', 'ǔ', 'ǚ', 'ň'],
    ['à', 'ò', 'è', 'ì', 'ù', 'ǜ']
];

function getYunmu(word) {
    const shenmus = [
        'ch', 'sh', 'zh', 'b', 'p', 'm', 'f', 'd', 't', 'n', 'l', 'g', 'k', 'h', 'j', 'q', 'x', 'r', 'z', 'c', 's', 'y', 'w'
    ];
    const py = pinyin(word);
    const shenmu = shenmus.find(i => flattenDeep(py).some(j => j.startsWith(i)));
    return word.replace(shenmu, '');
}

/**
 * @param {String} word
 * @return {number[]} - 0|1|2|3
 */
function getToneType(word) {
    let wordPinyin = flat(pinyin(word)).join(',');
    let result = [];
    for (let index = 0; index < TONE.length; index++) {
        let i = TONE[index];
        if (some(i, j => wordPinyin.indexOf(j) > -1)) {
            result.push(index);
        }
    }
    return result;
}

function getPinYinToneType(py) {
    for (let index = 0; index < TONE.length; index++) {
        let i = TONE[index];
        if (some(i, j => py.indexOf(j) > -1)) {
            return index;
        }
    }
    return -1;
}

/**
 * 随机产生一个声调
 * @param {number[]} excludeToneTypes - 除了这个声调, 只能是这几个数字0,1,2,3
 * @return number - 0|1|2|3
 */
function randomToneType(excludeToneTypes) {
    let num = Math.floor(Math.random() * 4);
    if (excludeToneTypes.length === 0 || uniq(excludeToneTypes).length >= 4) {
        return num;
    }
    if (excludeToneTypes.some(i => isSameToneType(i, num))) {
        return randomToneType([...excludeToneTypes, num]);
    }
    return num;
}

function randomWord(toneType, { wuxings }) {
    const allWords = toneWords[toneType];
    const result = allWords[Math.floor(Math.random() * allWords.length)];
    if (wuxings && wuxings.length) {
        const resultWuxing = wordWuxing[result];
        if (!resultWuxing || !wuxings.includes(resultWuxing)) {
            return randomWord(toneType, { wuxings });
        }
    }
    return result;
}

/**
 * 判断两个字是否都为平或仄
 * @param {string} toneType1
 * @param {string} toneType2
 */
function isSameToneType(toneType1, toneType2) {
    return Math.floor(toneType1 / 2) === Math.floor(toneType2 / 2);
}

/**
 * 根据拼音生成汉字
 * @param {string} py - 拼音
 * @param {string[]} wuxings - 五行
 */
function randomWordByPinyin(py, { wuxings }) {
    let toneType = getPinYinToneType(py);
    if (toneType === -1) {
        throw new Error(`拼音"${py}"书写不对`);
    }

    for (let i = 0; i < 3000; i++) {
        let word = randomWord(toneType, { wuxings });
        console.log('word', flat(pinyin(word)));
        if (flat(pinyin(word)).some(j => j.indexOf(py) > -1)) {
            return word;
        }
    }
    throw new Error(`拼音"${py}"书写不对`);
}

/**
 * 检查是否相同韵母
 * @param words
 */
function isSameYunmu(...words) {
    if (!words || words.length < 2) {
        return false;
    }
    return words.every(i => getYunmu(i) === getYunmu(words[0]));
}

export function randomName(lastName, { wuxings, nameLength = 2, firstNamePinyins = [] }) {
    let nameTones = [];
    let result;
    if (firstNamePinyins && firstNamePinyins.filter(i => i).length > 0) {
        result = reduce(firstNamePinyins.filter(i => i), (fullName, firstNamePinyin) => {
            fullName += randomWordByPinyin(firstNamePinyin, { wuxings });
            return fullName;
        }, lastName);
    } else {
        for (let i = 0; i < nameLength; i++) {
            if (i === 0) {
                nameTones.push(randomToneType([])); //第二个字不做限制，可以是任意声调
            } else if (i === 1) {
                nameTones.push(randomToneType([nameTones[0]])); //平仄平、仄平仄、平平仄、仄仄平
            } else {
                nameTones.push(randomToneType([...getToneType(lastName), ...nameTones]));//第三个字
            }
        }

        result = reduce(nameTones, (fullName, nameTone) => {
            let word;
            let max = 10;
            let i = 0;
            while (i < max && (!word || isSameYunmu(word, fullName.charAt(fullName.length - 1)))) { //相邻两字韵母不能相同
                word = randomWord(nameTone, { wuxings });
                i++;
            }
            if (i === max) {
                return fullName;
            }

            return fullName + word;
        }, lastName);
    }

    return result.split('').map(i => {
        return {
            content: i,
            pinyin: pinyin(i),
            wuxing: wordWuxing[i]
        };
    });
}
