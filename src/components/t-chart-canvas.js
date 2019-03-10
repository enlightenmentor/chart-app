import { LitElement, html, svg, css } from 'lit-element';
import throttle from '../utils/throttle.js';

class TChartCanvas extends LitElement {
  static get styles() {
    return css`
      svg {
        width: 100%;
        height: 100%;
      }
      path { transition: opacity 0.3s }
      path.hidden { opacity: 0 }
    `;
  }

  render() {
    this._checkVisibleSets();
    return svg`
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 ${this.viewBox.x} ${this.viewBox.y}">
        ${this.chart.map(set => {
          let d = this._computePath(set.points);
          return svg`
            <path
              d=${d}
              class="${set.visible ? '' : 'hidden'}"
              fill="none"
              stroke="${set.color}"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width=${this.strokeWidth}>
            </path>
          `;
        })}
      </svg>
    `;
  }

  static get properties() {
    return {
      chart: Array,
      _prevVisibleSets: Number,
      viewBox: String,
      strokeWidth: Number
    }
  }

  connectedCallback() {
    super.connectedCallback();
    this._computeViewBox();
    window.addEventListener(
      'resize',
      throttle(this._computeViewBox.bind(this), 50)
    );
  }

  _computeViewBox() {
    if (!this.offsetWidth || !this.offsetHeight) {
      this.style = 'display: block; height: 100%';
    }
    const ratio = this.offsetWidth/this.offsetHeight;
    let y = this._getViewBoxHeight();
    y = this._normilizeCoord(y);
    let x = ratio*y;
    this.viewBox = {x, y};
    this.strokeWidth = this.viewBox.y/50;
  }

  _computePath(set) {
    const xStep = this.viewBox.x/(set.length-1);
    return set.reduce((path, point, i) => {
      let x = xStep*i;
      let y = point.y*this.normalizer;
      y = this.viewBox.y - y;
      return `${path}${x} ${y}L`;
    }, 'M').slice(0, -1);
  }

  _getViewBoxHeight() {
    let y = this.chart
      .filter(set => set.visible)
      .reduce((acc, set) => acc.concat(set.points), [])
      .reduce((max, point) => point.y > max ? point.y : max, 0);
    return y * 1.1;
  }

  _normilizeCoord(n) {
    let order = Math.floor(n).toString().length;
    this.normalizer = Math.pow(10, 3-order)
    return n*this.normalizer;
  }

  _checkVisibleSets() {
    let visibleSets = this.chart.filter(set => set.visible).length;
    if (
      this._prevVisibleSets && 
      visibleSets != this._prevVisibleSets
    ) {
      this._animateViewBox();
    }
    this._prevVisibleSets = visibleSets;
  }

  _animateViewBox() {
    let y = this._getViewBoxHeight() * this.normalizer;
    if (y && this.viewBox.y != y) {
      console.log(this.viewBox.y, y);
    }
  }
}

customElements.define('t-chart-canvas', TChartCanvas);