(function() {
  const supportsCustomElementsV1 = 'customElements' in window;
  console.log('custom element is supported', supportsCustomElementsV1);

  const KEYCODE = {
    SPACE: 32,
    ENTER: 13,
  };

  const template = document.createElement('template');
  template.innerHTML = `
    <style>        
        :host {
            display: inline-block;
            border: var(--toggle-button-border, 2px solid currentColor);
            color: var(--toggle-button-color, currentColor);
            background-color: var(--toggle-button-background-color, currentColor);
            padding: 10px 20px;
            border-radius: var(--toggle-button-border-radius, 0);
            position: relative;
            overflow: hidden;
        }
        :host([pressed]) {
            background: lightgreen;
            color: darkgreen;
        }
        :host([disabled]) {
            opacity: 0.5;
            pointer-events: none;
        }       
    </style>
    <slot></slot>
  `;

  class ToggleButton extends HTMLElement {
    static get observedAttributes() {
      return ['pressed', 'disabled'];
    }

    constructor() {
      super();
      this.attachShadow({ mode: 'open' });
      this.shadowRoot.appendChild(template.content.cloneNode(true));
    }

    connectedCallback() {
      if (!this.hasAttribute('role')) {
        this.setAttribute('role', 'button');
      }

      if (!this.hasAttribute('tabindex')) {
        this.setAttribute('tabindex', '0');
      }

      if (!this.hasAttribute('area-pressed')) {
        this.setAttribute('area-pressed', 'false');
      }

      this.addEventListener('keydown', this._onKeyDown);
      this.addEventListener('click', e => {
        this._drawRipple(e.offsetX, e.offsetY);
        this._onClick();
      });
    }

    set pressed(value) {
      const isPressed = Boolean(value);
      if (isPressed) {
        this.setAttribute('pressed', '');
      } else {
        this.removeAttribute('pressed');
      }
    }

    get pressed() {
      return this.hasAttribute('pressed');
    }

    set disabled(value) {
      const isDisabled = Boolean(value);
      if (isDisabled) {
        this.setAttribute('disabled', '');
      } else {
        this.removeAttribute('disabled');
      }
    }

    get disabled() {
      return this.hasAttribute('disabled');
    }

    attributeChangeCallback(name, oldVal, newVal) {
      const hasValue = newVal !== null;
      this.setAttribute(`area-${name}`, hasValue);
    }

    _onClick() {
      this._togglePressed();
    }

    _onKeyDown(even) {
      if (event.altkey) {
        return;
      }

      switch (even.code) {
        case KEYCODE.ENTER:
        case KEYCODE.SPACE:
          event.preventDefault();
          this._togglePressed();
          break;
        default:
          break;
      }
    }

    _togglePressed() {
      this.pressed = !this.pressed;
    }

    // Material design ripple animation.
    _drawRipple(x, y) {
      let div = document.createElement('div');
      let event = new Event('transitionend');
      div.classList.add('ripple');
      this.appendChild(div);
      div.style.top = `${y - div.clientHeight / 2}px`;
      div.style.left = `${x - div.clientWidth / 2}px`;
      div.style.backgroundColor = 'currentColor';
      div.addEventListener('transitionend', () => div.remove());
      window.setTimeout(() => {
        div.dispatchEvent(event);
      }, 1900);
    }
  }

  window.customElements.define('toggle-button', ToggleButton);
})();
