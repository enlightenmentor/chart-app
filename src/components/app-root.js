import { LitElement, html, css } from 'lit-element';
import generateRandomData from '../utils/random-data.js';
import './t-radio-button.js';
import './t-theme-switch.js';

class AppRoot extends LitElement {
  static get styles() {
    return css`
      :host([theme="light"]) {
        --green: #3cc23f;
        --red: #f34c44;
        --accent: #1676f4;
        --primary-text: #192434;
        --tertiary-text: hsla(214, 53%, 23%, 0.16);
        --background: #ffffff;
      }
      :host([theme="dark"]) {
        --green: #3cc23f;
        --red: #f34c44;
        --accent: #1676f4;
        --primary-text: hsla(0, 0%, 100%, 0.9);
        --tertiary-text: hsla(0, 0%, 100%, 0.3);
        --background: #192434;
      }
      :host {
        display: flex;
        flex-direction: column;
        height: 100vh;
        background-color: var(--background);
      }
      .app__title {
        padding: 1rem;
        margin: 0;
        color: var(--primary-text);
      }
      .app__actions {
        display: flex;
        flex: 1;
        padding: 1rem;
      }
      .app__joined-button {
        --radio-button-color: var(--green);
        margin-right: 1rem;
      }
      .app__left-button {
        --radio-button-color: var(--red);
      }
      .app__theme-switch {
        padding-bottom: 1rem;
      }
    `;
  }

  render() {
    return html`
      <h3 class="app__title">Followers</h3>
      <div class="app__actions">
        <t-radio-button class="app__joined-button" checked>Joined</t-radio-button>
        <t-radio-button class="app__left-button" checked>Left</t-radio-button>
      </div>
      <t-theme-switch
        .theme=${this.theme}
        @theme-changed=${this.themeChanged}
        class="app__theme-switch">
      </t-theme-switch>
    `
  }

  static get properties() {
    return {
      data: Object,
      theme: {
        type: String,
        reflect: true
      }
    }
  }

  constructor() {
    super();
    this.theme = 'light';
    this.data = generateRandomData();
  }

  themeChanged(e) {
    this.theme = e.detail.value;
  }
}

customElements.define('app-root', AppRoot);