(function () {
  const supportsCustomElementsV1 = 'customElements' in window;
  console.log('custom element is supported', supportsCustomElementsV1);

  const template = document.createElement('template');
  template.innerHTML = `
    <style>        
        :host {
            all: initial;
            display: block;
            contain: content;
        }                   
    </style>
    <svg viewbox="0 0 170 170" width="170" height="170"
         xmlns="http://www.w3.org/2000/svg">
         <g transform="rotate(105 85 85)">
            <circle 
                    stroke="rgba(209,236,255,0.92)"
                    stroke-width="14"
                    fill="none"
                    cx="85"
                    cy="85"
                    stroke-linecap="butt"
                    stroke-dasharray="400.35, 400.35"
                    r="70"
                    >
            </circle>
        </g>

         <g transform="rotate(105 85 85)">
          <circle class="radialBar" stroke-width="14"
                  stroke="#5dc7c3"
                  stroke-dasharray="0, 400.35"
                  stroke-linecap="butt"
                  fill="none"
                  cx="85"
                  cy="85"
                  r="70"
                  >
          </circle>
        </g>

        <text class="label"
              x="85"
              y="85"
              alignment-baseline="central"
              text-anchor="middle" 
              font-size="80">
        </text>
    </svg>
  `;

  class RatingChart extends HTMLElement {
    /*
    Example:
    Radius = 85
    Percentage to fill = 25
    π = 3.14159
    Circumference = 2 * π * Radius = 534
    Get 1/8 part: 524 / 8   (1/8 = 45deg)
    Get 6/8 sum: range = 524 / 8 * 6 = 400.35   we need to fill only 270deg
    Stroke length = (range / 100) * Percentage to fill
    */

    //  if ratings =='N/A'
    //  set ratings = 0
    //  endif
    //  set radius = 72
    //  set percentage_to_fill = ratings * 10
    //  set Pi = 3.14159
    //  set circumference = 2 * Pi * radius
    //  set range = circumference / 8 * 6
    //  set stroke_length = range / 100 *  percentage_to_fill

    constructor() {
      super();
      this.attachShadow({mode: 'open'});
      this.shadowRoot.appendChild(template.content.cloneNode(true));

      this.svg = this.shadowRoot.querySelector('svg');
      this.text = this.shadowRoot.querySelector('text');
      this.radialBar = this.shadowRoot.querySelector('.radialBar');
    }

    static get observedAttributes() {
      return ['value', 'color', 'size'];
    }

    get value() {
      return this.getAttribute('value');
    }

    set value(newValue) {
      this.setAttribute('value', newValue);
    }

    get size() {
      return this.getAttribute('size');
    }

    set size(newValue) {
      this.setAttribute('size', newValue);
    }

    get color() {
      return this.getAttribute('color');
    }

    set color(newValue) {
      this.setAttribute('color', newValue);
    }

    attributeChangedCallback(name, oldValue, newValue) {
      switch (name) {
        case 'value':
          this.text.innerHTML = this.value;
          this.radialBar.setAttribute('stroke-dasharray', `${(400.35 / 100) * (this.value * 10)}, 400.35`);
          break;

        case 'size':
          this.svg.setAttribute('width', this.size);
          this.svg.setAttribute('height', this.size);
          break;

        case 'color':
          this.radialBar.setAttribute('stroke', this.color);
          break;
      }
    }
  }

  window.customElements.define('rating-chart', RatingChart);
})();
