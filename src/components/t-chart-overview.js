import { LitElement, html, css, svg } from 'lit-element';
import './t-chart-canvas.js';

class TChartOverview extends LitElement {
  static get styles() {
    return css`
      :host {
        display: block;
        position: relative;
      }
    `;
  }

  render() {
    return html`
      <t-chart-canvas
        class="chart__canvas"
        .chart=${this.chart}>
      </t-chart-canvas>
      <!-- <div class="chart__viewport"></div> -->
    `;
  }

  static get properties() {
    return {
      chart: Array
    }
  }
}

customElements.define('t-chart-overview', TChartOverview);