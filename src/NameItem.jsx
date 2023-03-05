import React from 'react';

function speak(text, speaker) {
    // Create a new instance of SpeechSynthesisUtterance.
    const msg = new SpeechSynthesisUtterance();

    // Set the text.
    msg.text = text;

    // // Set the attributes.
    // msg.volume = parseFloat(volumeInput.value);
    // msg.rate = parseFloat(rateInput.value);
    // msg.pitch = parseFloat(pitchInput.value);

    // If a voice has been selected, find the voice and set the
    // utterance instance's voice attribute.
    if (speaker.name) {
        msg.voice = speechSynthesis.getVoices().filter(voice => voice.name === speaker.name)[0];
    }

    // Queue this utterance.
    window.speechSynthesis.speak(msg);
}

const NameItem = ({name, onClickPinyin, lastName, speaker}) => {
    const finalName = name.map(i => i.content).join('');

    return <li style={{marginTop: '8px'}}>
        {finalName}
        ({name.map((j, index) => {
        if (j.content === lastName.trim()) {
            return j.pinyin;
        }
        return <button className="a" onClick={() => {
            onClickPinyin(index, j.pinyin[0][0]);
        }}>{j.pinyin}</button>;
    })})
        【{name.map(i => i.wuxing).join('')}】
        <button onClick={() => speak(finalName, speaker)}>读</button>
    </li>
};

export default NameItem;
