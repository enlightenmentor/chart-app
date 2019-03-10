import { LitElement, html, css } from 'lit-element';

class TThemeSwitch extends LitElement {
  static get styles() {
    return css`
      :host {
        display: block;
        text-align: center;
      }
      p {
        display: inline-block;
        padding: 0.5rem 1rem;
        margin: 0;
        color: var(--accent);
        cursor: pointer;
      }
    `;
  }

  render() {
    switch (this.theme) {
      case 'light':
        return html`<p @click=${this._switchTheme.bind(this,'dark')}>Switch to Nigth Mode</p>`;
      case 'dark':
        return html`<p @click=${this._switchTheme.bind(this,'light')}>Switch to Day Mode</p>`;
    }
  }

  static get properties() {
    return {
      theme: String
    }
  }

  constructor() {
    super();
  }

  _switchTheme(theme) {
    this.theme = theme;
    this.dispatchEvent(new CustomEvent('theme-changed', {
      detail: { value: this.theme },
    }));
  }
}

customElements.define('t-theme-switch', TThemeSwitch);