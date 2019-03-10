import { LitElement, html, css } from 'lit-element';
import './t-radio-button.js';

class AppRoot extends LitElement {
  static get styles() {
    return css`
      :host {
        --green: #3cc23f;
        --red: #f34c44;
      }
      :host { display: block }
      .app__title {
        padding: 1rem;
        margin: 0;
      }
      .app__actions {
        display: flex;
        padding: 1rem;
      }
      .app__joined-button {
        --radio-button-color: var(--green);
        margin-right: 1rem;
      }
      .app__left-button {
        --radio-button-color: var(--red);
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
    `
  }
}

customElements.define('app-root', AppRoot);