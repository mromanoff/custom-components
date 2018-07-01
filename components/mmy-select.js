(function () {
    const supportsCustomElementsV1 = 'customElements' in window;
    console.log('custom element is supported', supportsCustomElementsV1);

    const template = document.createElement('template');
    template.innerHTML = `
    <style>        
        :host {
            display: block;
        }
        
        :host([horizontal]) {
            display: flex;
            align-items: center;
            justify-content: center;
        }
                
        :host([horizontal]) > *  {
            margin: 0 10px 0 0;
            width: 25%;
        }
        
        :host([horizontal]) > :last-child {
            margin: 0;
        }
                
        select {
            height: 2rem;
            width: 100%;
            margin-bottom: 1rem;
        }
        
        button {
            display: inline-block;
            border: var(--toggle-button-border, 2px solid currentColor);
            color: var(--toggle-button-color, currentColor);
            background-color: var(--toggle-button-background-color, currentColor);
            padding: 10px 20px;
            border-radius: var(--toggle-button-border-radius, 0);
            font-size: 12px;
        }
        
        button[disabled] {
            opacity: 0.5;
            pointer-events: none;
        }
        
    </style>
    <select id="makes">
        <option>Choose Make</option>
    </select>
    <select id="models">
        <option>Choose Model</option>
    </select>
    <select id="years">
        <option>Choose Year</option>
    </select>
    
    <button id="submit" disabled>Search Now</button>
  `;

    class MMYSelect extends HTMLElement {
        constructor() {
            super();
            this.attachShadow({mode: 'open'});
            this.shadowRoot.appendChild(template.content.cloneNode(true));

            this._makes = this.shadowRoot.getElementById('makes');
            this._makes.addEventListener('change', this._onMakeChange.bind(this));

            this._models = this.shadowRoot.getElementById('models');
            this._models.addEventListener('change', this._onModelChange.bind(this));

            this._years = this.shadowRoot.getElementById('years');
            this._years.addEventListener('change', this._onYearChange.bind(this));

            this._submit = this.shadowRoot.getElementById('submit');
            this._submit.addEventListener('click', this._onSubmit.bind(this));

            this.state = {
                make: null,
                model: null,
                year: null,
            };
        }

        connectedCallback() {
            this._fetch('mock-makes.json').then(data => this._initMakes(data));
            this._fetch('mock-models.json').then(data => this._initModels(data));
            this._fetch('mock-years.json').then(data => this._initYears(data));
        }

        async _fetch(uri) {
            try {
                const response = await
                    fetch(uri);
                return await
                    response.json();
            } catch (error) {
                console.error(error);
            } finally {
                console.log('finally');
            }
        }

        _initMakes(data) {
            const popular = data.filter(makes => makes.isPopular === true);
            const other = data.filter(makes => makes.isPopular === false);
            this._createOptGroup(this._makes, popular, 'Popular Makes');
            this._createOptGroup(this._makes, other, 'Other Makes');
        }

        _initModels(data) {
            const current = data.filter(makes => makes.isOld !== true);
            const old = data.filter(makes => makes.isOld === false);
            this._createOptGroup(this._models, current, 'Current Models');
            this._createOptGroup(this._models, old, 'Older Models');
        }

        _initYears(data) {
            this._createOptionList(this._years, data);
        }

        _createOptionList(el, options) {
            let option;
            options.forEach(item => {
                option = document.createElement('option');
                option.value = item.id;
                option.text = item.title;
                el.appendChild(option);
            })
            ;
        }

        _createOptGroup(el, options, label) {
            let optgroup;
            optgroup = document.createElement('optgroup');
            optgroup.label = label;
            el.appendChild(optgroup);
            this._createOptionList(optgroup, options);
        }

        _onMakeChange(event) {
            const make = event.currentTarget.options[event.currentTarget.selectedIndex].value;
            this._setState({
                make,
            });
        }

        _onModelChange(event) {
            const model = event.currentTarget.options[event.currentTarget.selectedIndex].value;
            this._setState({
                model,
            });
        }

        _onYearChange(event) {
            const year = event.currentTarget.options[event.currentTarget.selectedIndex].value;
            this._setState({
                year,
            });
            this._canSubmit = true;
        }

        _onSubmit() {
            const {make, model, year} = this.state;
            console.log('submit', `/makes/${make}/models/${model}/years/${year}`);
        }

        _setState(newState) {
            this.state = Object.assign({}, this.state, newState);
        }

        set _canSubmit(value) {
            const isDisabled = Boolean(value);
            // expect true for submit and false to disabled
            if (!isDisabled) {
                this._submit.setAttribute('disabled', '');
            } else {
                this._submit.removeAttribute('disabled');
            }
        }

        get _canSubmit() {
            return this._submit.hasAttribute('disabled');
        }
    }

    window.customElements.define('mmy-select', MMYSelect);
})();
