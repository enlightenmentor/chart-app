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
      path { transition: opacity 200ms }
      path.hidden { opacity: 0 }
    `;
  }

  render() {
    this._checkMaxVisibleHeight();
    this.xScale = (this.width/this.viewwidth)/this._getDataWidth();
    const xShift = -(this.width/this.viewwidth)*this.viewoffset;
    return svg`
      <svg
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
        viewBox="0 0 ${this.width} ${this.height}">
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
              transform="translate(${xShift})"
              stroke-width="2">
            </path>
          `;
        })}
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
      .reduce((max, point) => point.y > max ? point.y : max, 0) * 1.1;
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