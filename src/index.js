import flat from 'lodash-es/flatten';
import includes from 'lodash-es/includes';
import reduce from 'lodash-es/reduce';
import some from 'lodash-es/some';
import uniq from 'lodash-es/uniq';
import pinyin from 'pinyin';
import Ui from './ui';
import toneWords from './words';

const TONE = [
    ['ā', 'ō', 'ē', 'ī', 'ū', 'ǖ'],
    ['á', 'ó', 'é', 'í', 'ú', 'ǘ', 'ń'],
    ['ǎ', 'ǒ', 'ě', 'ǐ', 'ǔ', 'ǚ', 'ň'],
    ['à', 'ò', 'è', 'ì', 'ù', 'ǜ']
];

const lastName = '范';

/**
 * @param {String} word
 * @return {number} - 0|1|2|3
 */
function getToneType(word) {
    let wordPinyin = flat(pinyin(word))[0];
    for (let index = 0; index < TONE.length; index++) {
        let i = TONE[index];
        if (some(i, j => wordPinyin.indexOf(j) > -1)) {
            return index;
        }
    }
}

/**
 * 随机产生一个声调
 * @param {number[]} excludeToneTypes - 除了这个声调, 只能是这几个数字0,1,2,3
 */
function randomToneType(excludeToneTypes) {
    let num = Math.floor(Math.random() * 4);
    if (uniq(excludeToneTypes).length >= 4) {
        return num;
    }

    if (includes(excludeToneTypes, num)) {
        return randomToneType(excludeToneTypes);
    }
    return num;
}

function randomName(lastName) {
    let nameLength = 2;
    //let nameLength = Math.floor(Math.random() * 2) + 1;
    let nameTones = [];
    for (let i = 0; i < nameLength; i++) {
        nameTones.push(randomToneType([getToneType(lastName), ...nameTones]));
    }
    return reduce(nameTones, (fullName, nameTone) => {
        const words = toneWords[nameTone];
        fullName += words[Math.floor(Math.random() * words.length)];
        return fullName;
    }, lastName);
}

const ui = new Ui({
    onStart(lastName) {
        ui.clearNameList();
        for (let i = 0; i < 5; i++) {
            ui.appendName(randomName(lastName));
        }
    }
});
ui.appendToBody();

