import flat from 'lodash-es/flatten';
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
 */
function randomToneType(excludeToneTypes) {
    let num = Math.floor(Math.random() * 4);
    if (excludeToneTypes.length === 0 || uniq(excludeToneTypes).length >= 4) {
        return num;
    }
    if (excludeToneTypes.some(i => Math.floor(i / 2) === Math.floor(num / 2))) {
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

export function randomName(lastName, { wuxings, nameLength = 2, firstNamePinyins = [] }) {
    let nameTones = [];
    if (firstNamePinyins && firstNamePinyins.filter(i => i).length > 0) {
        return reduce(firstNamePinyins.filter(i => i), (fullName, firstNamePinyin) => {
            fullName += randomWordByPinyin(firstNamePinyin, { wuxings });
            return fullName;
        }, lastName);
    }
    for (let i = 0; i < nameLength; i++) {
        if (i === 0) {
            nameTones.push(randomToneType([]));
        } else {
            nameTones.push(randomToneType([...getToneType(lastName), ...nameTones]));
        }
    }
    return reduce(nameTones, (fullName, nameTone) => {
        fullName += randomWord(nameTone, { wuxings });
        return fullName;
    }, lastName);
}
