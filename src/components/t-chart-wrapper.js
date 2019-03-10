import { LitElement, html, css } from 'lit-element';
import './t-chart-overview.js';
import './t-radio-button.js';
import './t-theme-switch.js';

class TChartWrapper extends LitElement {
  static get styles() {
    return css`
      :host {
        display: flex;
        flex-direction: column;
        margin-bottom: 3rem;
      }
      .app__title {
        margin: 1rem;
        color: var(--primary-text);
      }
      .app__chart-overview {
        margin: 1rem 0.5rem;
        height: 5rem;
        border: 1px solid var(--tertiary-text);
      }
      .app__actions {
        display: flex;
        flex: 1;
        margin: 1rem 0.5rem;
      }
      .app__actions > *:not(:last-child) {
        margin-right: 0.5rem;
      }
    `;
  }

  render() {
    return html`
      <h3 class="app__title">${this.title}</h3>
      <t-chart></t-chart>
      <t-chart-overview
        class="app__chart-overview"
        .chart="${this.chart}">
      </t-chart-overview>
      <div class="app__actions">
        ${Object.keys(this.chart.names).map(key => html`
          <t-radio-button
            checked
            style="--radio-button-color: ${this.chart.colors[key]}">
            ${this.chart.names[key]}
          </t-radio-button>
        `)}
      </div>
    `;
  }

  static get properties() {
    return {
      title: String,
      chart: Object
    }
  }
}

customElements.define('t-chart-wrapper', TChartWrapper);