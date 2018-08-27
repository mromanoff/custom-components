(function () {
  const supportsCustomElementsV1 = 'customElements' in window;
  console.log('custom element is supported', supportsCustomElementsV1);

  const template = document.createElement('template');
  template.innerHTML = `
    <style>        
        :host {
            display: inline-block;
        }   
        
        .chart {
        }  
        
        .radialBarBase {
            stroke: #9ec2e1;
        }
        
        .radialBar {
            stroke: #45ABB3;
        }
    </style>
    <svg class="chart" viewbox="0 0 170 170" width="170" height="170"
         xmlns="http://www.w3.org/2000/svg">
         <g transform="rotate(105 85 85)">
            <circle class="radialBarBase"
                    stroke-width="14"
                    fill="none"
                    cx="85"
                    cy="85"
                    stroke-linecap="round"
                    stroke-dasharray="400.35, 400.35"
                    r="70"
 
                    >
            </circle>
        </g>

         <g transform="rotate(105 85 85)">
          <circle id="circle" class="radialBar" stroke-width="14"
                  stroke-dasharray="0, 400.35"
                  stroke-linecap="round"
                  fill="none"
                  cx="85"
                  cy="85"
                  r="70"
                  >
          </circle>
        </g>

        <text id="label" class="ratings-chart__rating"
              x="85"
              y="85"
              alignment-baseline="central"
              text-anchor="middle" font-size="46">
            <slot>70</slot>
        </text>
    </svg>
  `;

  class RatingChart extends HTMLElement {
    static get observedAttributes() {
      return ['rating', 'value'];
    }

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

      this.label = this.shadowRoot.getElementById('label');
      this.circle = this.shadowRoot.getElementById('circle');
    }

    attributeChangedCallback(name, oldVal, newVal) {
      const hasValue = newVal !== null;
      this.label.innerHTML = hasValue ? newVal : oldVal;
      this.circle.setAttribute('stroke-dasharray', `${(400.35 / 100) * (newVal * 10)}, 400.35`);
    }
  }

  window.customElements.define('rating-chart', RatingChart);
})();
