import { LitElement, html, css } from 'lit-element';
import throttle from '../utils/throttle.js';
import './t-main-chart-renderer.js';
import './t-overview-chart-renderer.js';
import './t-chart-viewport.js';
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
        margin: 1rem 1.25rem;
        color: var(--primary-text);
        transition: color var(--color-tr-duration);
      }
      .app__main-chart {
        display: block;
        position: relative;
        height: 30rem;
        max-height: 50vh;
        margin: 0 1rem 1rem;
      }
      .app__chart-overview {
        display: block;
        position: relative;
        height: 3rem;
        margin: 0.5rem 1rem;
      }
      .app__chart-viewport {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
      }
      .app__actions {
        display: flex;
        flex: 1;
        flex-wrap: wrap;
        margin: 1rem;
      }
      .app__set-checker {
        margin: 0 0.5rem 0.5rem 0;
      }
    `;
  }

  render() {
    return html`
      <h3 class="app__title">${this.title}</h3>

      <div class="app__main-chart">
        <t-main-chart-renderer
          .viewwidth=${this.viewportWidth}
          .viewoffset=${this.viewportOffset}
          .chart=${this.chart}>
        </t-main-chart-renderer>
      </div>

      <div class="app__chart-overview">
        <t-overview-chart-renderer
          class="chart__canvas"
          .chart=${this.chart}>
        </t-overview-chart-renderer>
        <t-chart-viewport
          class="app__chart-viewport"
          width="${this.viewportWidth}"
          min-width="0.1"
          offset="${this.viewportOffset}">
        </t-chart-viewport>
      </div>

      <div class="app__actions">
        ${this.chart.map((set,i) => html`
          <t-radio-button
            class="app__set-checker"
            ?checked=${set.visible}
            @checked-changed=${this.changeVisibility.bind(this,i)}
            style="--radio-button-color: ${set.color}">
            ${set.name}
          </t-radio-button>
        `)}
      </div>
    `;
  }

  static get properties() {
    return {
      title: String,
      chart: Array,
      viewportWidth: Number,
      viewportOffset: Number
    }
  }

  constructor() {
    super();
    this.viewportWidth = 0.25;
    this.viewportOffset = 0.75;
  }

  connectedCallback() {
    super.connectedCallback();
    this.addEventListener(
      'fractions-changed',
      throttle(this._fractionsChanged.bind(this), 1000/60)
    );
  }

  changeVisibility(i, e) {
    this.chart[i] = Object.assign(this.chart[i], { visible: e.detail.value });
    this.chart = this.chart.slice();
  }

  _fractionsChanged(e) {
    this.viewportWidth = e.detail.width;
    this.viewportOffset = e.detail.offset;
  }
}

customElements.define('t-chart-wrapper', TChartWrapper);