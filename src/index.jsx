import React, {
    Fragment,
    useState
} from 'react';
import * as ReactDOM from 'react-dom';
import {randomName} from './name-random';

const rootElement = document.createElement('div');
document.body.append(rootElement);

const Main = () => {
    const [lastName, setLastName] = useState('');
    const [wuxings, setWuxings] = useState([]);
    const [names, setNames] = useState([]);
    const [pinyins, setPinyins] = useState(['', '']);

    const start = () => {
        const result = [];
        for (let i = 0; i < 5; i++) {
            result.push(randomName(lastName, {wuxings, firstNamePinyins: pinyins}));
        }
        setNames(result);
    };

    return <Fragment>
        <div><a target='_blank' href="https://baike.baidu.com/item/%E5%96%9C%E7%94%A8%E7%A5%9E/10646208">如何计算五行缺什么</a></div>
        <div>
            <label>姓</label>
            <input value={lastName}
                   onChange={(e) => setLastName(e.target.value)}/>
        </div>
        <div>
            <label>五行</label>
            {[['jin', '金'], ['mu', '木'], ['shu', '水'], ['huo', '火'], ['tu', '土']].map(i => (
                <label style={{marginRight: '10px'}} key={i[0]}>
                    <input type='checkbox'
                           name='wuxing'
                           value={i[0]}
                           onChange={e => {
                               if (e.target.checked) {
                                   setWuxings([...wuxings, e.target.value]);
                               } else {
                                   setWuxings([...wuxings].splice(wuxings.indexOf(e.target.value), 1));
                               }
                           }}/>{i[1]}
                </label>
            ))}
        </div>
        <div>
            <label>拼音</label>
            <input value={pinyins[0]} onChange={e => setPinyins([e.target.value, pinyins[1]])}/>
            <input value={pinyins[1]} onChange={e => setPinyins([pinyins[0], e.target.value])}/>
        </div>
        <div>
            <button onClick={() => start()}>开始</button>
        </div>
        {names.length ? <ul>
            {names.map((i, idx) => <li key={idx}>{i}</li>)}
        </ul> : ''}
    </Fragment>;
};
ReactDOM.render(<div><Main/></div>, rootElement);


