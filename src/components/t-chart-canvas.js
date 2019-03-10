import { LitElement, html, svg, css } from 'lit-element';

class TChartCanvas extends LitElement {
  static get styles() {
    return css`
      :host {
        display: block;
      }
      svg {
        width: 100%;
        height: 100%;
      }
    `;
  }

  render() {
    this.viewBox = this._getViewBoxFromData(this.data.columns, this.dimensions);
    let strokeWidth = this.viewBox.y/50;

    return svg`
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 ${this.viewBox.x} ${this.viewBox.y}">
        ${this.data.columns.slice(1).map(column => {
          let key = column[0];
          let d = this._computePath(column);
          return svg`
            <path
              d=${d}
              fill="none"
              stroke="${this.data.colors[key]}"
              stroke-width=${strokeWidth}>
            </path>
          `;
        })}
      </svg>
    `;
  }

  static get properties() {
    return {
      data: Array,
      dimensions: Object,
      viewBox: String
    }
  }

  connectedCallback() {
    super.connectedCallback();
    this.dimensions = this._getDimensions(); 
  }

  _getDimensions() {
    return {
      width: this.offsetWidth,
      height: this.offsetHeight,
      ratio: this.offsetWidth/this.offsetHeight
    }
  }

  _getViewBoxFromData(columns, d) {
    let y = columns.slice(1).reduce((acc, column) => {
      return acc.concat(column.slice(1));
    }, []).reduce((max, val) => {
      return val > max ? val : max;
    }, 0);
    y *= 1.1;
    let x = d.ratio*y;
    return {x, y};
  }

  _computePath(data) {
    const xStep = this.viewBox.x/(data.length-2);
    return data.slice(1).reduce((path, val, i) => {
      let x = xStep*i;
      let y = this.viewBox.y - val;
      return `${path}${x} ${y}L`;
    }, "M").slice(0, -1);
  }
}

customElements.define('t-chart-canvas', TChartCanvas);