import { LitElement, html, css } from 'lit-element';
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
        height: 3.5rem;
        background-color: lightgrey;
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