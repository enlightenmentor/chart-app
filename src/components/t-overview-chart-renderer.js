import { LitElement, html, svg, css } from 'lit-element';
import throttle from '../utils/throttle.js';
import animateValue from '../utils/animate.js';

class TOverviewChartRenderer extends LitElement {
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
    if (this.width && this.height) {
      this._checkVisibleSets();
      return html`
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
                stroke-width="1">
              </path>
            `;
          })}
        </svg>
      `;
    } else {
      return html``;
    }
  }

  static get properties() {
    return {
      chart: Array,
      width: Number,
      height: Number,
      xScale: Number,
      yScale: Number,
      _prevVisibleSets: Number
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
    function defineDimensions() {
      const rect = this.getBoundingClientRect();
      this.width = rect.width;
      this.height = rect.height;
      this.yScale = this.height/this._getDataHeight();
      this.xScale = this.width/this._getDataWidth();
    }
    if (!this.offsetWidth || !this.offsetHeight) {
      this.style = 'display: block; height: 100%';
      setTimeout(defineDimensions.bind(this),0);
    } else {
      defineDimensions.call(this);
    }
  }

  _computePath(set) {
    return set.reduce((path, point) => {
      let x = (point.x * this.xScale).toFixed(4);
      let y = (this.height - point.y*this.yScale).toFixed(4);
      return `${path}${x} ${y}L`;
    }, 'M').slice(0, -1);
  }

  _getDataHeight() {
    let y = this.chart
      .filter(set => set.visible)
      .reduce((acc, set) => acc.concat(set.points), [])
      .reduce((max, point) => point.y > max ? point.y : max, 0);
    return y * 1.1;
  }

  _getDataWidth() {
    let x = this.chart[0].points.length;
    return x - 1;
  }
  

  _checkVisibleSets() {
    let newVisibleSets = this.chart.filter(set => set.visible).length;
    if (
      this._prevVisibleSets != null && 
      newVisibleSets != 0 &&
      newVisibleSets != this._prevVisibleSets
    ) {
      this._animateScale();
    }
    this._prevVisibleSets = newVisibleSets;
  }

  _animateScale() {
    const from = this.yScale;
    const to = this.height/this._getDataHeight();
    const animation = animateValue([from, to], {
      duration: 200,
      easing: 'EASE_OUT_QUAD'
    });
    animation(val => { this.yScale = val });
  }
}

customElements.define('t-overview-chart-renderer', TOverviewChartRenderer);