(function() {
  const supportsCustomElementsV1 = 'customElements' in window;
  console.log('custom element is supported', supportsCustomElementsV1);

  const template = document.createElement('template');
  template.innerHTML = `
    <style>        
        :host {
            display: block;
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
    static get observedAttributes() {
      return ['pressed', 'disabled'];
    }

    constructor() {
      super();
      this.attachShadow({ mode: 'open' });
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
        canSubmit: false,
        make: null,
        model: null,
        year: null,
      };
    }

    connectedCallback() {
      this._initMakes();
      this._initModels();
      this._initYears();
    }

    set disabled(value) {
      const isDisabled = Boolean(value);
      if (isDisabled) {
        this._submit.setAttribute('disabled', '');
      } else {
        this._submit.removeAttribute('disabled');
      }
    }

    get disabled() {
      return this._submit.hasAttribute('disabled');
    }

    _toggleDisabled() {
      this.disabled = !this.disabled;
    }

    // _canSubmit() {
    //   if (!this.state.canSubmit) {
    //     this._submit.setAttribute('disabled', 'disabled');
    //   } else {
    //     this._submit.removeAttribute('disabled');
    //   }
    // }

    _initMakes() {
      console.log('init makes');
      this._initDropdownList(this._makes, MOCK_DATA_MAKES);
    }

    _initModels() {
      console.log('init models');
      this._initDropdownList(this._models, MOCK_DATA_MODELS);
    }

    _initYears() {
      console.log('init years');
      this._initDropdownList(this._years, MOCK_DATA_YEARS);
    }

    _initDropdownList(el, options) {
      let option;
      options.forEach(item => {
        option = document.createElement('option');
        option.value = item.id;
        option.text = item.title;
        el.add(option);
      });
    }

    _onMakeChange(event) {
      const make =
        event.currentTarget.options[event.currentTarget.selectedIndex].value;
      this._setState({
        make,
      });
    }

    _onModelChange(event) {
      const model =
        event.currentTarget.options[event.currentTarget.selectedIndex].value;
      this._setState({
        model,
      });
    }

    _onYearChange(event) {
      const year =
        event.currentTarget.options[event.currentTarget.selectedIndex].value;
      this._setState({
        year,
        canSubmit: true,
      });
      //this._canSubmit();
      this._toggleDisabled()
    }

    _onSubmit() {
      const {make, model, year} = this.state;
      console.log('submit', `/makes/${make}/models/${model}/years/${year}` );
    }

    _setState(newState) {
      this.state = Object.assign({}, this.state, newState);
    }
  }
  const MOCK_DATA_MAKES = [
    { id: 'acura', title: 'Acura', isPopular: true },
    { id: 'audi', title: 'Audi', isPopular: true },
    { id: 'bmw', title: 'BMW', isPopular: true },
    { id: 'buick', title: 'Buick', isPopular: true },
    { id: 'cadillac', title: 'Cadillac', isPopular: true },
    { id: 'chevrolet', title: 'Chevrolet', isPopular: true },
    { id: 'chrysler', title: 'Chrysler', isPopular: true },
    { id: 'dodge', title: 'Dodge', isPopular: true },
    { id: 'ford', title: 'Ford', isPopular: true },
    { id: 'gmc', title: 'GMC', isPopular: true },
    { id: 'honda', title: 'Honda', isPopular: true },
    { id: 'hyundai', title: 'Hyundai', isPopular: true },
    { id: 'jaguar', title: 'Jaguar', isPopular: true },
    { id: 'jeep', title: 'Jeep', isPopular: true },
    { id: 'kia', title: 'Kia', isPopular: true },
    { id: 'land-rover', title: 'Land Rover', isPopular: true },
    { id: 'lexus', title: 'Lexus', isPopular: true },
    { id: 'lincoln', title: 'Lincoln', isPopular: true },
    { id: 'mazda', title: 'Mazda', isPopular: true },
    { id: 'mercedes-benz', title: 'Mercedes-Benz', isPopular: true },
    { id: 'mercury', title: 'Mercury', isPopular: true },
    { id: 'mitsubishi', title: 'Mitsubishi', isPopular: true },
    { id: 'nissan', title: 'Nissan', isPopular: true },
    { id: 'pontiac', title: 'Pontiac', isPopular: true },
    { id: 'porsche', title: 'Porsche', isPopular: true },
    { id: 'saturn', title: 'Saturn', isPopular: true },
    { id: 'scion', title: 'Scion', isPopular: true },
    { id: 'subaru', title: 'Subaru', isPopular: true },
    { id: 'suzuki', title: 'Suzuki', isPopular: true },
    { id: 'toyota', title: 'Toyota', isPopular: true },
    { id: 'volkswagen', title: 'Volkswagen', isPopular: true },
    { id: 'volvo', title: 'Volvo', isPopular: true },
    { id: 'alfa-romeo', title: 'Alfa Romeo', isPopular: false },
    { id: 'am-general', title: 'AM General', isPopular: false },
    { id: 'aston-martin', title: 'Aston Martin', isPopular: false },
    { id: 'bentley', title: 'Bentley', isPopular: false },
    { id: 'daewoo', title: 'Daewoo', isPopular: false },
    { id: 'daihatsu', title: 'Daihatsu', isPopular: false },
    { id: 'eagle', title: 'Eagle', isPopular: false },
    { id: 'ferrari', title: 'Ferrari', isPopular: false },
    { id: 'fiat', title: 'FIAT', isPopular: false },
    { id: 'fisker', title: 'Fisker', isPopular: false },
    { id: 'freightliner', title: 'Freightliner', isPopular: false },
    { id: 'genesis', title: 'Genesis', isPopular: false },
    { id: 'geo', title: 'Geo', isPopular: false },
    { id: 'hummer', title: 'HUMMER', isPopular: false },
    { id: 'infiniti', title: 'INFINITI', isPopular: false },
    { id: 'isuzu', title: 'Isuzu', isPopular: false },
    { id: 'lamborghini', title: 'Lamborghini', isPopular: false },
    { id: 'lotus', title: 'Lotus', isPopular: false },
    { id: 'maserati', title: 'Maserati', isPopular: false },
    { id: 'maybach', title: 'Maybach', isPopular: false },
    { id: 'mclaren', title: 'McLaren', isPopular: false },
    { id: 'merkur', title: 'Merkur', isPopular: false },
    { id: 'mini', title: 'MINI', isPopular: false },
    { id: 'oldsmobile', title: 'Oldsmobile', isPopular: false },
    { id: 'panoz', title: 'Panoz', isPopular: false },
    { id: 'peugeot', title: 'Peugeot', isPopular: false },
    { id: 'plymouth', title: 'Plymouth', isPopular: false },
    { id: 'ram', title: 'Ram', isPopular: false },
    { id: 'rolls-royce', title: 'Rolls-Royce', isPopular: false },
    { id: 'saab', title: 'Saab', isPopular: false },
    { id: 'smart', title: 'smart', isPopular: false },
    { id: 'sterling', title: 'Sterling', isPopular: false },
    { id: 'tesla', title: 'Tesla', isPopular: false },
  ];

  const MOCK_DATA_YEARS = [
    { id: 2018, title: 2018 },
    { id: 2017, title: 2017 },
    { id: 2016, title: 2016 },
    { id: 2015, title: 2015 },
    { id: 2014, title: 2014 },
    { id: 2013, title: 2013 },
  ];

  const MOCK_DATA_MODELS = [
    { id: 'ilx', title: 'ILX', isOld: false },
    { id: 'mdx', title: 'MDX', isOld: false },
    { id: 'nsx', title: 'NSX', isOld: false },
    { id: 'rdx', title: 'RDX', isOld: false },
    { id: 'rlx', title: 'RLX', isOld: false },
    { id: 'tl', title: 'TL', isOld: false },
    { id: 'tlx', title: 'TLX', isOld: false },
    { id: 'tsx', title: 'TSX', isOld: false },
    { id: 'tsx-sport-wagon', title: 'TSX Sport Wagon', isOld: false },
    { id: 'cl', title: 'CL', isOld: true },
    { id: 'integra', title: 'Integra', isOld: true },
    { id: 'legend', title: 'Legend', isOld: true },
    { id: 'rl', title: 'RL', isOld: true },
    { id: 'rsx', title: 'RSX', isOld: true },
    { id: 'slx', title: 'SLX', isOld: true },
    { id: 'vigor', title: 'Vigor', isOld: true },
    { id: 'zdx', title: 'ZDX', isOld: true },
  ];

  window.customElements.define('mmy-select', MMYSelect);
})();