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
        ${this.chart.map((set,i) => html`
          <t-radio-button
            ?checked=${set.visible}
            @checked-changed=${this.changeVisibility.bind(this,i)}
            style="--radio-button-color: ${set.color}">
            ${set.label}
          </t-radio-button>
        `)}
      </div>
    `;
  }

  static get properties() {
    return {
      title: String,
      chart: Array
    }
  }

  changeVisibility(i, e) {
    this.chart[i] = Object.assign(this.chart[i], { visible: e.detail.value });
    this.chart = this.chart.slice();
  }
}

customElements.define('t-chart-wrapper', TChartWrapper);