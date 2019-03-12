import { LitElement, html, css, svg } from 'lit-element';
import throttle from '../utils/throttle.js';
import draggable from '../utils/draggable.js';

class TChartViewport extends LitElement {
  static get styles() {
    return css`
      :host {
        display: block;
        position: relative;
      }
      #leftOverflow, #rightOverflow, #window, #rightBorder, #leftBorder {
        display: block;
        height: 100%;
        box-sizing: border-box;
        position: absolute;
        top: 0;
      }
      #leftOverflow, #window, #leftBorder {
        transform-origin: left;
        left: 0;
      }
      #rightOverflow, #rightBorder {
        transform-origin: right;
        right: 0;
      }
      #leftOverflow, #rightOverflow {
        width: 100%;
        background-color: var(--overflow-background);
      }
      #window {
        width: 100%;
        border-top: 2px solid var(--overflow-border);
        border-bottom: 2px solid var(--overflow-border);
        cursor: grab;
      }
      #rightBorder, #leftBorder {
        width: 100px;
        background-color: var(--overflow-border);
        cursor: ew-resize;
      }
    `;
  }

  render() {
    const lFr = this.offset;
    const wFr = this.width;
    const wFrShift = (1/wFr)*this.offset*100;
    const rFr = 1-this.offset-this.width;
    const bWidth = 8/wFr;

    return html`
      <div
        id="leftOverflow"
        style="transform: scaleX(${lFr}) translateX(0)">
      </div>
      <div
        id="window"
        style="transform: scaleX(${wFr}) translateX(${wFrShift}%)">
        <div
          id="leftBorder"
          style="width: ${bWidth}px">
        </div>
        <div
          id="rightBorder"
          style="width: ${bWidth}px">
        </div>
      </div>
      <div
        id="rightOverflow"
        style="transform: scaleX(${rFr})">
      </div>
    `;
  }

  static get properties() {
    return {
      width: {
        type: Number,
        reflect: true
      },
      offset: {
        type: Number,
        reflect: true
      }
    }
  }

  connectedCallback() {
    super.connectedCallback();
    this._defineWidth();
    window.addEventListener(
      'resize',
      throttle(this._defineWidth.bind(this), 1000/60)
    );
  }

  _defineWidth() {
    if (!this.offsetWidth)
      this.style = 'display: block;';
    this._pixelWidth = this.offsetWidth;
  }

  firstUpdated() {
    draggable(
      this.shadowRoot.querySelector('#leftBorder')
    ).onDrag(e => {
      console.log(e.detail.movementX);
    });
    draggable(
      this.shadowRoot.querySelector('#rightBorder')
    ).onDrag(e => {
      console.log(e.detail.movementX);
    });
  }
}

customElements.define('t-chart-viewport', TChartViewport);