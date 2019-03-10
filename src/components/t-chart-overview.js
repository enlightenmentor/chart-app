import { LitElement, html, css, svg } from 'lit-element';
import './t-chart-canvas.js';

class TChartOverview extends LitElement {
  static get styles() {
    return css`
      :host {
        display: block;
        position: relative;
      }
      .chart__canvas {
        height: 100%;
      }
      .chart__viewport {
        height: 100%;
      }
    `;
  }

  render() {
    return html`
      <t-chart-canvas class="chart__canvas" .data=${this.chart}></t-chart-canvas>
      <!-- <div class="chart__viewport"></div> -->
    `;
  }

  static get properties() {
    return {
      chart: Array,
    }
  }
}

customElements.define('t-chart-overview', TChartOverview);