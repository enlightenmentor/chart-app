import { LitElement, html, svg, css } from 'lit-element';
import throttle from '../utils/throttle.js';
import animateValue from '../utils/animate.js';

class TMainChartRenderer extends LitElement {
  static get styles() {
    return css`
      svg {
        width: 100%;
        height: 100%;
      }
      text {
        font-size: 0.875rem;
        transition: fill var(--color-tr-duration)
      }
      .chart__axe { transition: stroke var(--color-tr-duration) }
      .chart__set { transition: opacity 200ms }
      .chart__set.hidden { opacity: 0 }
    `;
  }

  render() {
    this._checkMaxVisibleHeight();
    this.xScale = (this.width/this.viewwidth)/this._getDataWidth();
    this.yAxeScale = this._computeYAxeScale(this.yAxeScale);
    const xShift = (-(this.width/this.viewwidth)*this.viewoffset).toFixed(2);
    return svg`
      <svg
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
        viewBox="0 0 ${this.width} ${this.height}">
        <path
          d=${this._computeYAxePath()}
          class="chart__axe"
          fill="none"
          stroke="var(--tertiary-text)"
          stroke-linecap="round"
          stroke-width="1">
        </path>
        ${this.chart.map(set => svg`
          <path
            d=${this._computePath(set.points)}
            class="chart__set ${set.visible ? '' : 'hidden'}"
            fill="none"
            stroke="${set.color}"
            stroke-linecap="round"
            stroke-linejoin="round"
            transform="translate(${xShift})"
            stroke-width="2">
          </path>
        `)}
        ${this._computeYLegendText().map(point => svg`
          <text
            fill="var(--secondary-text)"
            x="${point.x}"
            y="${point.y}">
            ${point.text}
          </text>
        `)}
      </svg>
    `;
  }

  static get properties() {
    return {
      chart: Array,
      viewwidth: Number,
      viewoffset: Number,
      width: Number,
      height: Number,
      xScale: Number,
      yScale: Number,
      yAxeScale: Number,
      _prevVisibleSets: Number,
      _prevMaxHeight: Number
    }
  }

  connectedCallback() {
    super.connectedCallback();
    this._defineDimensions();
    window.addEventListener(
      'resize',
      throttle(this._defineDimensions.bind(this), 1000/10)
    );
  }

  _defineDimensions() {
    if (!this.offsetWidth || !this.offsetHeight) {
      this.style = 'display: block; height: 100%';
    }
    this.width = this.offsetWidth;
    this.height = this.offsetHeight;
    this.yScale = this.height/this._getMaxDataHeight();
    this.xScale = (this.width/this.viewwidth)/this._getDataWidth();
    this.yAxeScale = 50;
  }

  _computeYLegendText() {
    const step = this.yAxeScale*this.yScale;
    let points = [];
    let i = 0;
    while(true) {
      let y = (this.height-step*i).toFixed(2);
      if (y < 20) break;
      points.push({
        x: 0,
        y: y-10,
        text: this.yAxeScale*i
      })
      i += 1;
    }
    return points;
  }

  _computeYAxePath(s) {
    const step = this.yAxeScale*this.yScale;
    let path = '';
    let i = 0;
    while(true) {
      let y = (this.height-step*i).toFixed(2);
      if (y < 16) break;
      path += `M0 ${y}L${this.width} ${y}`
      i += 1;
    }
    return path;
  }

  _computeYAxeScale(scale) {
    while(true) {
      let step = scale*this.yScale;
      if (step > 100) {
        scale /= 2;
      } else if (step < 50) {
        scale *= 2;
      } else {
        break;
      }
    }
    return scale;
  }

  _computePath(set) {
    return set.reduce((path, point) => {
      let x = (point.x * this.xScale).toFixed(4);
      let y = (this.height - point.y*this.yScale).toFixed(4);
      return `${path}${x} ${y}L`;
    }, 'M').slice(0, -1);
  }

  _getMaxDataHeight() {
    const i0 = Math.floor(this.viewoffset*this.chart[0].points.length);
    const i1 = Math.ceil((this.viewoffset+this.viewwidth)*this.chart[0].points.length);
    return this.chart
      .filter(set => set.visible)
      .reduce((acc,set) => acc.concat(set.points.slice(i0,i1)), [])
      .reduce((max, point) => point.y > max ? point.y : max, 0) * 1.05;
  }

  _getDataWidth() {
    let x = this.chart[0].points.length;
    return x - 1;
  }

  _checkMaxVisibleHeight() {
    const newVisibleSets = this.chart.filter(set => set.visible).length;
    if (newVisibleSets != 0) {
      const newMaxHeight = this._getMaxDataHeight();
      if (
        this._prevVisibleSets != null && 
        newVisibleSets != this._prevVisibleSets
      ) {
        let to = this.height/newMaxHeight;
        this._animateScale(this.yScale,to,200);
      } else if (
        this._prevMaxHeight != null &&
        this._prevMaxHeight != newMaxHeight
      ) {
        let from = this.height/this._prevMaxHeight;
        let to = this.height/newMaxHeight;
        this._animateScale(from,to,100);
      }
      this._prevMaxHeight = newMaxHeight;
    }
    this._prevVisibleSets = newVisibleSets;
  }

  _animateScale(from, to, duration) {
    animateValue([from, to], {
      duration,
      easing: 'EASE_OUT_QUAD'
    })(val => { this.yScale = val });
  }
}

customElements.define('t-main-chart-renderer', TMainChartRenderer);