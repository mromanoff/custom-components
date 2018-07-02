(function () {
    const supportsCustomElementsV1 = 'customElements' in window;
    console.log('custom element is supported', supportsCustomElementsV1);

    const template = document.createElement('template');
    template.innerHTML = `
    <style>        
        :host {
            --star-active:  #ff7a19;
            --star-default: #b4c8da;
            /* all: initial to reset all global style values so that they don’t affect our element’s styles. */
            all: initial;
            display: block;
             /*contain, to hint to the CSS engine that the styles are contained and independent. */
            contain: content;
        }
           
        /* hide radio inputs */ 
        input[type="radio"] {
            position: absolute !important;
            left: -9999em !important;
        }    
        
        /* hide 'none' input from screenreaders */
        input[type="radio"][disabled] {
            display: none
        }
        
        label {
            cursor: pointer;
            display: inline-block;
        }
        
        /* make hover effect work properly in IE */
        svg {
            pointer-events: none;
            fill: var(--star-active);
            width: 36px;
            height: auto;
        }
                
        /* if any input is checked, make its following siblings grey */
        input[type="radio"]:checked ~ label svg {
            fill: var(--star-default);
        }
                        
        /* make hovered input's following siblings grey on hover */
        input[type="radio"]:hover ~ label svg {
            fill: var(--star-default);
        }
       
    </style>
    <div>
        <input disabled checked name="rating" value="0" type="radio">
    
        <label aria-label="1 star" for="rating-1">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
            <path d="M9 11.3l3.71 2.7-1.42-4.36L15 7h-4.55L9 2.5 7.55 7H3l3.71 2.64L5.29 14z"></path>
          </svg>
        </label>
        <input name="rating" id="rating-1" value="1" type="radio">
        
        <label aria-label="2 stars" for="rating-2">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
            <path d="M9 11.3l3.71 2.7-1.42-4.36L15 7h-4.55L9 2.5 7.55 7H3l3.71 2.64L5.29 14z"></path>
          </svg>
        </label>
        <input name="rating" id="rating-2" value="2" type="radio">
        
        <label aria-label="3 stars" for="rating-3">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
            <path d="M9 11.3l3.71 2.7-1.42-4.36L15 7h-4.55L9 2.5 7.55 7H3l3.71 2.64L5.29 14z"></path>
          </svg>
        </label>
        <input name="rating" id="rating-3" value="3" type="radio">
        
        <label aria-label="4 stars" for="rating-4">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
            <path d="M9 11.3l3.71 2.7-1.42-4.36L15 7h-4.55L9 2.5 7.55 7H3l3.71 2.64L5.29 14z"></path>
          </svg>
        </label>
        <input name="rating" id="rating-4" value="4" type="radio">
        
        <label aria-label="5 stars" for="rating-5">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
            <path d="M9 11.3l3.71 2.7-1.42-4.36L15 7h-4.55L9 2.5 7.55 7H3l3.71 2.64L5.29 14z"></path>
          </svg>
        </label>
        <input name="rating" id="rating-5" value="5" type="radio">
    </div>
  `;

    class FiveStarInput extends HTMLElement {

        constructor() {
            super();
            this.attachShadow({mode: 'open'});
            this.shadowRoot.appendChild(template.content.cloneNode(true));
            this.radios = this.shadowRoot.querySelectorAll('input');
            this._setInputName();
        }

        get name() {
            return this.getAttribute('name');
        }

        _setInputName() {
            if(this.name) {
                this.radios.forEach(radio => radio.setAttribute('name', this.name));
            }
        }
    }

    window.customElements.define('five-star-input', FiveStarInput);
})();
