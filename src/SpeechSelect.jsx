import React, {useEffect, useRef, useState} from 'react';

const SpeechSelectInner = ({onChange}) => {
    const [voices, setVoices] = useState(speechSynthesis.getVoices().filter(i => i.lang.startsWith('zh-')));
    useEffect(() => {
        const fn = function(e) {
            setVoices(speechSynthesis.getVoices().filter(i => i.lang.startsWith('zh-')));
        }
        speechSynthesis.addEventListener('voiceschanged', fn);
        return () => {
            speechSynthesis.removeEventListener('voiceschanged', fn);
        }
    }, []);
    const onChangeFiredByVoiceChanged = useRef(false);
    useEffect(() => {
        if (voices.length > 0 && !onChangeFiredByVoiceChanged.current) {
            onChange(voices[0]);
            onChangeFiredByVoiceChanged.current = true;
        }
    }, [voices]);

    if (!voices.length) {
        return null;
    }
    return <div>
        <label>选择发言人</label>
        <select onChange={e => onChange(voices.find(i => i.name === e.target.value))}>
            {voices.map(i => <option value={i.name}>{i.name}</option>)}
        </select>
    </div>
};
const SpeechSelect = (props) => {
    if ('speechSynthesis' in window) {
        return <SpeechSelectInner {...props}/>;
    } else {
        return null;
    }
}

export default SpeechSelect;
