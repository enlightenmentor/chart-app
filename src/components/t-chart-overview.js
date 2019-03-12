import { LitElement, html, css, svg } from 'lit-element';
import './t-chart-canvas.js';
import './t-chart-viewport.js';

class TChartOverview extends LitElement {
  static get styles() {
    return css`
      :host {
        display: block;
        position: relative;
      }
      .chart__viewport {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
      }
    `;
  }

  render() {
    return html`
      <t-chart-canvas
        class="chart__canvas"
        .chart=${this.chart}>
      </t-chart-canvas>
      <t-chart-viewport
        width="0.25"
        offset="0.5"
        class="chart__viewport">
      </t-chart-viewport>
    `;
  }

  static get properties() {
    return {
      chart: Array
    }
  }
}

customElements.define('t-chart-overview', TChartOverview);