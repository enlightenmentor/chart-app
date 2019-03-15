import { LitElement, html, css, svg } from 'lit-element';
import './t-overview-chart-renderer.js';
import './t-chart-viewport.js';

class TOverviewChart extends LitElement {
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
      <t-overview-chart-renderer
        class="chart__canvas"
        .chart=${this.chart}>
      </t-overview-chart-renderer>
      <t-chart-viewport
        width="${this.width}"
        min-width="0.1"
        offset="${this.offset}"
        class="chart__viewport">
      </t-chart-viewport>
    `;
  }

  static get properties() {
    return {
      chart: Array,
      width: Number,
      offset: Number,
    }
  }
}

customElements.define('t-overview-chart', TOverviewChart);