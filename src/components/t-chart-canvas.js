import { LitElement, html, svg, css } from 'lit-element';

class TChartCanvas extends LitElement {
  static get styles() {
    return css`
      svg {
        width: 100%;
        height: 100%;
      }
    `;
  }

  render() {
    this.viewBox = this._getViewBoxFromData(this.chart, this.dimensions);
    const strokeWidth = this.viewBox.y/50;

    return svg`
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 ${this.viewBox.x} ${this.viewBox.y}">
        ${this.chart.filter(set => set.visible).map(set => {
          let d = this._computePath(set.points);
          return svg`
            <path
              d=${d}
              fill="none"
              stroke="${set.color}"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width=${strokeWidth}>
            </path>
          `;
        })}
      </svg>
    `;
  }

  static get properties() {
    return {
      chart: Array,
      dimensions: Object,
      viewBox: String
    }
  }

  connectedCallback() {
    super.connectedCallback();
    this.dimensions = this._getDimensions(); 
  }

  _getDimensions() {
    if (!this.offsetWidth || !this.offsetHeight) {
      this.style = 'display: block; height: 100%;';
    }
    return {
      width: this.offsetWidth,
      height: this.offsetHeight,
      ratio: this.offsetWidth/this.offsetHeight || 1
    }
  }

  _getViewBoxFromData(chart, d) {
    let y = chart
      .filter(set => set.visible)
      .reduce((acc, set) => acc.concat(set.points), [])
      .reduce((max, point) => point.y > max ? point.y : max, 0);
    y = this._normilizeCoord(y)
    y *= 1.1;
    let x = d.ratio*y;
    return {x, y};
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

  _normilizeCoord(n) {
    let order = Math.floor(n).toString().length;
    this.normalizer = Math.pow(10, 3-order)
    return n*this.normalizer;
  }
}

customElements.define('t-chart-canvas', TChartCanvas);