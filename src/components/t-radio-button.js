import { LitElement, html, css } from 'lit-element';

class TRadioButton extends LitElement {
  static get styles() {
    return css`
      :host {
        --radio-button-color: var(--accent);
      }

      :host {
        display: inline-block;
        font-family: apple-system, BlinkMacSystemFont, "Roboto", "Segoe UI", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
        font-size: 0.75rem;
      }
      slot {
        color: var(--primary-text);
        transition: color var(--color-tr-duration);
        font-size: 1rem;
      }
      .button {
        display: flex;
        align-items: center;
        background-color: transparent;
        border: 1px solid var(--border-color);
        padding: 0.5rem 1rem 0.5rem 0.5rem;
        border-radius: 99rem;
        cursor: pointer;
        outline: none;
        transition: border var(--color-tr-duration);
      }
      .toggler {
        display: flex;
        position: relative;
        align-items: center;
        justify-content: center;
        width: 1.5rem;
        height: 1.5rem;
        margin-right: 0.5rem;
        border-radius: 99rem;
        background-color: var(--radio-button-color);
      }
      .toggler-icon {
        width: calc(1.5rem - 6px);
        height: calc(1.5rem - 6px);
        fill: white;
        transition: transform 0.1s 0.05s ease-in-out;
      }
      .toggler-shader {
        display: flex;
        position: absolute;
        top: 1px;
        left: 1px;
        box-sizing: border-box;
        width: calc(1.5rem - 2px);
        height: calc(1.5rem - 2px);
        background-color: var(--background);
        border-radius: 50%;
        transition: transform 0.1s ease-in-out, background-color var(--color-tr-duration);
      }
      :host([checked]) .toggler-icon {
        transform: scale(1);
      }
      :host(:not([checked])) .toggler-icon {
        transform: scale(0);
      }
      :host([checked]) .toggler-shader {
        transform: scale(0);
      }
      :host(:not([checked])) .toggler-shader {
        transform: scale(1);
      }
    `;
  }

  render() {
    return html`
      <button class="button" @click=${this.toggle}>
        <div class="toggler">
          <svg class="toggler-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path fill="none" d="M0 0h24v24H0V0z"/>
            <path d="M9 16.2l-3.5-3.5c-.39-.39-1.01-.39-1.4 0-.39.39-.39 1.01 0 1.4l4.19 4.19c.39.39 1.02.39 1.41 0L20.3 7.7c.39-.39.39-1.01 0-1.4-.39-.39-1.01-.39-1.4 0L9 16.2z"/>
          </svg>
          <div class="toggler-shader"></div>
        </div>
        <slot></slot>
      </button>
    `
  }

  static get properties() {
    return {
      checked: {
        type: Boolean,
        reflect: true
      }
    }
  }

  constructor() {
    super();
    this.checked = false;
  }

  toggle() {
    this.checked = !this.checked;
    this.dispatchEvent(new CustomEvent('checked-changed', {
      detail: { value: this.checked },
    }));
  }
}

customElements.define('t-radio-button', TRadioButton);