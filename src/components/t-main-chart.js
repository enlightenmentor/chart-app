import { LitElement, html, css, svg } from 'lit-element';
import './t-main-chart-renderer.js';

class TMainChart extends LitElement {
  static get styles() {
    return css`
      :host {
        display: block;
        position: relative;
      }
      .chart__canvas {
        width: 100%;
        height: 100%;
      }
    `;
  }

  render() {
    return html`
      <t-main-chart-renderer
        class="chart__canvas"
        .viewwidth=${this.width}
        .viewoffset=${this.offset}
        .chart=${this.chart}>
      </t-main-chart-renderer>
    `;
  }

  static get properties() {
    return {
      chart: Array,
      width: Number,
      offset: Number
    }
  }
}

customElements.define('t-main-chart', TMainChart);