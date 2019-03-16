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
      #leftOverflow, #rightOverflow, #windowBox, #window, #rightBorder, #leftBorder {
        display: block;
        height: 100%;
        box-sizing: border-box;
        position: absolute;
        top: 0;
        transition: background-color var(--color-tr-duration);
      }
      #leftOverflow, #windowBox, #window, #leftBorder {
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
        z-index: -1;
      }
      #windowBox {
        width: 100%;
        border-top: 1px solid var(--overflow-border);
        border-bottom: 1px solid var(--overflow-border);
        transition: border-color var(--color-tr-duration);
        touch-action: none;
        cursor: grab;
      }
      #rightBorder, #leftBorder {
        width: 100px;
        box-sizing: border-box;
        transition: border-color var(--color-tr-duration);
        cursor: ew-resize;
      }
    `;
  }

  render() {
    const lFr = this.offset;
    const wFr = this.width;
    const wFrShift = (1/wFr)*this.offset*100;
    const rFr = 1-this.offset-this.width;
    const bWidth = 15/wFr;
    const bBWidth = 6/wFr;

    return html`
      <div
        id="leftOverflow"
        style="transform: scaleX(${lFr}) translateX(0)">
      </div>
      <div
        id="windowBox"
        style="transform: scaleX(${wFr}) translateX(${wFrShift}%)">
        <div
          id="leftBorder"
          style="width: ${bWidth}px; border-left: ${bBWidth}px solid var(--overflow-border)">
        </div>
        <div
          id="window">
        </div>
        <div
          id="rightBorder"
          style="width: ${bWidth}px; border-right: ${bBWidth}px solid var(--overflow-border)">
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
      minWidth: {
        type: Number,
        attribute: 'min-width',
        reflect: true
      },
      offset: {
        type: Number,
        reflect: true
      },
      _vWidth: Number,
      _vOffset: Number,
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
    this._vWidth = this.width;
    this._vOffset = this.offset;
  }

  firstUpdated() {
    this._initDraggables();
  }

  _initDraggables() {
    draggable(
      this.shadowRoot.querySelector('#leftBorder')
    ).onDrag(this._leftBorderDragged.bind(this));
    draggable(
      this.shadowRoot.querySelector('#rightBorder')
    ).onDrag(this._rightBorderDragged.bind(this));
    draggable(
      this.shadowRoot.querySelector('#window')
    ).onDrag(this._windowDragged.bind(this));
  }

  _leftBorderDragged(e) {
    switch(e.type) {
      case 'dragging':
        let frD = e.detail.movementX/this._pixelWidth;
        this._vOffset += frD;
        this._vWidth -= frD;
        let vROffset = 1-this._vOffset-this._vWidth;
        if (this._vOffset < 0) {
          this.offset = 0;
          this.width = 1-vROffset;
        } else if (this._vWidth < this.minWidth) {
          let offset = 1-vROffset-this.minWidth;
          offset = offset < 0 ? 0 : offset;
          this.offset = offset;
          this.width = this.minWidth;
        } else {
          this.offset = this._vOffset;
          this.width = this._vWidth;
        }
        this._fireFractionsChange();
        break;
      case 'draggingend':
        this._vOffset = this.offset;
        this._vWidth = this.width;
        break;
    }
  }

  _rightBorderDragged(e) {
    switch(e.type) {
      case 'dragging':
        let frD = e.detail.movementX/this._pixelWidth;
        this._vWidth += frD;
        let vROffset = 1-this._vOffset-this._vWidth;

        if (vROffset < 0) {
          this.width = 1-this._vOffset;
        } else if (this._vWidth < this.minWidth) {
          this.width = this.minWidth;
        } else {
          this.width = this._vWidth;
        }
        this._fireFractionsChange();
        break;
      case 'draggingend':
        this._vWidth = this.width;
    }
  }

  _windowDragged(e) {
    switch(e.type) {
      case 'dragging':
        let frD = e.detail.movementX/this._pixelWidth;
        this._vOffset += frD;
        let vROffset = 1-this._vOffset-this._vWidth;
        if (this._vOffset < 0) {
          this.offset = 0;
        } else if (vROffset < 0) {
          this.offset = 1-this._vWidth;
        } else {
          this.offset = this._vOffset;
        }
        this._fireFractionsChange();
        break;
      case 'draggingend':
        this._vOffset = this.offset;
    }
  }

  _fireFractionsChange() {
    this.dispatchEvent(new CustomEvent('fractions-changed', {
      composed: true,
      bubbles: true,
      detail: {
        width: this.width,
        offset: this.offset
      }
    }));
  }
}

customElements.define('t-chart-viewport', TChartViewport);