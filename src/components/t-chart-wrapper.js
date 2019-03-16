import { LitElement, html, css } from 'lit-element';
import throttle from '../utils/throttle.js';
import './t-main-chart.js';
import './t-overview-chart.js';
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
        height: 30rem;
        max-height: 50vh;
        margin: 0 1rem 1rem;
      }
      .app__chart-overview {
        margin: 0.5rem 1rem;
        height: 3rem;
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
    // this.mainChart = this._computeMainChart();
    return html`
      <h3 class="app__title">${this.title}</h3>
      <t-main-chart
        class="app__main-chart"
        .width=${this.viewportWidth}
        .offset=${this.viewportOffset}
        .chart=${this.chart}>
      </t-main-chart>
      <t-overview-chart
        class="app__chart-overview"
        .width=${this.viewportWidth}
        .offset=${this.viewportOffset}
        .chart=${this.chart}>
      </t-overview-chart>
      <div class="app__actions">
        ${this.chart.map((set,i) => html`
          <t-radio-button
            class="app__set-checker"
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

  _computeMainChart() {
    const o = this.viewportOffset;
    const w = this.viewportWidth;
    let i0 = this.chart[0].points.length*o;
    let i1 = this.chart[0].points.length*(o+w);
    return this.chart.map(set => {
      return Object.assign({}, set, {
        points: this._getSlicedArray(set.points, i0, i1)
      })
    });
  }

  _getSlicedArray(arr, i0, i1) {
    const in0 = Math.floor(i0);
    const in1 = Math.floor(i1);
    let res = arr.slice(i0,i1);
    res[0] = {
      x: i0,
      y: arr[in0].y+(arr[in0].y-arr[in0+1].y)*(i0-in0),
      label: res[0].label
    }
    let lastY;
    if (in1 === arr.length) {
      lastY = arr[in1-1].y
    } else {
      lastY = arr[in1-1].y+(arr[in1-1].y-arr[in1].y)*(i1-in1)
    }
    res.push({
      x: i1,
      y: lastY,
      label: res[res.length-1].label
    });
    return res.map(point => ({
      x: point.x-i0,
      y: point.y,
      label: point.label
    }));
  }
}

customElements.define('t-chart-wrapper', TChartWrapper);