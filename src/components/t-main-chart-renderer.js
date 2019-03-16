import { LitElement, html, svg, css } from 'lit-element';
import { repeat } from 'lit-html/directives/repeat';
import throttle from '../utils/throttle.js';
import animateValue from '../utils/animate.js';

class TMainChartRenderer extends LitElement {
  static get styles() {
    return css`
      text {
        font-size: 14px;
        fill: var(--secondary-text);
        transition: fill var(--color-tr-duration);
      }
      .chart__yAxe {
        fill: none;
        stroke-linecap: round;
        stroke-width: 1;
        stroke: var(--tertiary-text);
        transition: stroke var(--color-tr-duration);
      }
      .chart__set {
        fill: none;
        stroke-linecap: round;
        stroke-linejoin: round;
        stroke-width: 2;
        transition: opacity 200ms;
      }
      .chart__set.hidden { opacity: 0 }
      .chart__xAxeText {
        transition: opacity 300ms;
      }
      .chart__xAxeText[hidden] {
        opacity: 0;
      }
    `;
  }

  render() {
    this._checkMaxVisibleHeight();
    this.xScale = (this.width/this.viewwidth)/this._getDataWidth();
    this.yAxeScale = this._computeYAxeScale(this.yAxeScale);
    const xShift = (-(this.width/this.viewwidth)*this.viewoffset).toFixed(2);
    const yAxeMap = this._computeYAxeMap();
    const xAxeMap = this._computeXAxeMap();

    return svg`
      <svg
        class="chart__svg"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
        viewBox="0 0 ${this.width} ${this.height}">
        <g>
          ${yAxeMap.map(point => svg`
            <path
              d="M0 ${point.y}L${this.width} ${point.y}"
              class="chart__yAxe"/>
          `)}
        </g>
        <g transform="translate(${xShift})">
          ${this.chart.map(set => svg`
            <path
              d=${this._computePath(set.points)}
              class="chart__set ${set.visible ? '' : 'hidden'}"
              stroke="${set.color}"/>
          `)}
        </g>
        <g>
          ${yAxeMap.map(point => svg`
            <text
              x=${point.x}
              y=${point.y-10}>
              ${point.text}
            </text>
          `)}
        </g>
      </svg>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 ${this.width} 20">
        <g transform="translate(${xShift})">
          ${xAxeMap.map(point => svg`
            <text
              x=${point.x}
              y="18"
              class="chart__xAxeText"
              ?hidden=${point.hidden}
              text-anchor="end">
              ${point.text}
            </text>
          `)}
        </g>
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
    this.height = this.offsetHeight-20;
    this.yScale = this.height/this._getMaxDataHeight();
    this.xScale = (this.width/this.viewwidth)/this._getDataWidth();
    this.yAxeScale = 50;
  }

  _computeYAxeMap() {
    // 1, 2, 5, 10
    const step = this.yAxeScale*this.yScale;
    let points = [];
    let i = 0;
    while(true) {
      let y = (this.height-step*i).toFixed(2);
      let text;
      if (y < 16) break;
      if (y > 20) { text = this.yAxeScale*i }
      points.push({
        x: 0,
        y,
        text,
      })
      i += 1;
    }
    return points;
  }

  _computeXAxeMap() {
    const getBaseLog = (x, y) => Math.log(y) / Math.log(x);
    const TEXT_W = 48;
    const pow = Math.ceil(getBaseLog(0.5, this.xScale/TEXT_W));
    const n = Math.pow(2,pow);
    const odd = (this.chart[0].points.length-1)%2;
    return this.chart[0].points.map((point,i,arr) => {
      let j = arr.length-i-2;
      let hidden = (j+odd)%n != 0;
      return {
        x: point.x*this.xScale,
        hidden,
        text: point.label
      }
    });
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
        this._animateScale(from,to,75);
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