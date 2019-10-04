export default class {
    constructor({onStart = null}) {
        let element = document.createDocumentFragment();
        let formElement = document.createElement('form');
        let nameListElement = document.createElement('ol');
        element.append(formElement, nameListElement);

        formElement.addEventListener('submit', function(e) {
            e.preventDefault();
            if (typeof onStart === 'function') {
                onStart(e.target.elements['lastName'].value);
            }
        });

        formElement.innerHTML = `
            <label>姓:</label>
            <input name="lastName">
            <button type="submit">开始</button>
        `;

        this.element = element;
        this.formElement = formElement;
        this.nameListElement = nameListElement;
    }

    appendToBody() {
        document.body.appendChild(this.element);
    }

    appendName(randomName) {
        let liElement = document.createElement('li');
        liElement.innerText = randomName;
        this.nameListElement.appendChild(liElement);
    }

    clearNameList() {
        this.nameListElement.innerHTML = '';
    }
}
