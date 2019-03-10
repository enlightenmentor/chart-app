import { LitElement, html, css } from 'lit-element';
import chartData from '../data/chart-data.json';
import './t-chart-wrapper.js';

class AppRoot extends LitElement {
  static get styles() {
    return css`
      :host([theme="light"]) {
        --accent: #1676f4;
        --primary-text: #192434;
        --tertiary-text: hsla(214, 53%, 23%, 0.16);
        --background: #ffffff;
      }
      :host([theme="dark"]) {
        --accent: #1676f4;
        --primary-text: hsla(0, 0%, 100%, 0.9);
        --tertiary-text: hsla(0, 0%, 100%, 0.3);
        --background: #192434;
      }
      :host {
        display: flex;
        flex-direction: column;
        background-color: var(--background);
      }
      .app__theme-switch {
        margin: 1rem 0 2rem;
      }
    `;
  }

  render() {
    return html`
      ${this.charts.map((chart, i) => html`
        <t-chart-wrapper
          .chart=${chart}
          .title="Chart #${i+1}">
        </t-chart-wrapper>
      `)}
      <t-theme-switch
        .theme=${this.theme}
        @theme-changed=${this.themeChanged}
        class="app__theme-switch">
      </t-theme-switch>
    `
  }

  static get properties() {
    return {
      charts: Object,
      theme: {
        type: String,
        reflect: true
      }
    }
  }

  constructor() {
    super();
    this.theme = 'light';
    this.charts = chartData;
  }

  themeChanged(e) {
    this.theme = e.detail.value;
  }
}

customElements.define('app-root', AppRoot);