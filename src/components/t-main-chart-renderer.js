import { LitElement, html, svg, css } from 'lit-element';
import throttle from '../utils/throttle.js';
import animateValue from '../utils/animate.js';

const BASE_LOG = (x, y) => Math.log(y) / Math.log(x);

class TMainChartRenderer extends LitElement {
  static get styles() {
    return css`
      :host * {
        user-select: none;
      }
      text {
        font-size: 14px;
        fill: var(--secondary-text);
        transition: fill var(--color-tr-duration);
      }
      .chart__yAxe-text {
        font-size: 14px;
        line-height: 14px;
        height: 14px;
        color: var(--secondary-text);
        text-shadow: 0 0 4px var(--background), 0 0 4px var(--background), 0 0 4px var(--background), 0 0 4px var(--background), 0 0 4px var(--background), 0 0 4px var(--background), 0 0 4px var(--background), 0 0 4px var(--background), 0 0 4px var(--background);
        transition: color var(--color-tr-duration), text-shadow var(--color-tr-duration);
      }
      .chart__yAxe {
        fill: none;
        stroke-linecap: round;
        stroke-width: 1;
        stroke: var(--tertiary-text);
        transition: stroke var(--color-tr-duration);
      }
      .chart__yAxe:first-child {
        stroke: var(--secondary-text);
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
      .chart__hover-line {
        position: absolute;
        left: 0;
        top: 0;
        margin-left: -0.5px;
        width: 1px;
        background-color: var(--secondary-text);
        pointer-events: none;
      }
      #chart__tooltip {
        display: flex;
        position: absolute;
        flex-direction: column;
        padding: 0.5rem 0.75rem;
        background-color: var(--background);
        border-radius: 3px;
        box-shadow: 0 1px 4px -1px var(--shadow-color);
        transform: translate(-50%, -25%);
        transition: background-color var(--color-tr-duration), box-shadow var(--color-tr-duration);
      }
      .chart__tooltip-title {
        white-space: nowrap;
        color: var(--primary-text);
        transition: color var(--color-tr-duration);
        margin-bottom: 0.5rem;
      }
      .chart__tooltip-body > div {
        display: flex;
      }
      .chart__tooltip-body > div:not(:last-child) {
        margin-bottom: 0.5rem;
      }
      .chart__tooltip-set {
        display: flex;
        flex: 1;
        flex-direction: column;
      }
      .chart__tooltip-set:not(:last-child) {
        margin-right: 0.5rem;
      }
      .chart__tooltip-set > span:first-child {
        font-weight: bold;
        line-height: 1.25;
      }
      .chart__tooltip-set > span:last-child {
        font-size: 0.75rem;
      }
      .chart__line-circle {
        position: absolute;
        box-sizing: border-box;
        top: 0;
        height: 12px;
        width: 12px;
        transform: unset;
        margin-left: -5.5px;
        margin-top: -6px;
        border-radius: 50%;
        border: 2px solid;
        background-color: var(--background);
      }
    `;
  }

  render() {
    if (this.width && this.height) {
      this._checkMaxVisibleHeight();
      this.xScale = (this.width/this.viewwidth)/this._getDataWidth();
      this.yAxeScale = this._computeYAxeScale(this.yAxeScale);
      this._xShift = (-(this.width/this.viewwidth)*this.viewoffset);
      this._updateTooltip(this.hoveredI);
      const yAxeMap = this._computeYAxeMap();
      const xAxeMap = this._computeXAxeMap();

      return html`
        <svg
          class="chart__svg"
          @mousemove=${this._mouseMoveHandler}
          @touchmove=${this._touchMoveHandler}
          @mouseleave=${e => {
            this.hoveredI = null
          }}
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
          <g transform="translate(${this._xShift.toFixed(2)})">
            ${this.chart.map(set => svg`
              <path
                d=${this._computePath(set.points)}
                class="chart__set ${set.visible ? '' : 'hidden'}"
                stroke="${set.color}"/>
            `)}
          </g>
          <g>
            ${yAxeMap.map(point => svg`
              <foreignObject
                x=${point.x}
                y=${point.y-30}
                width="100"
                height="20">
                <span class="chart__yAxe-text">${point.text}</span>
              </foreignObject>
            `)}
          </g>
        </svg>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 ${this.width} 20">
          <g transform="translate(${this._xShift.toFixed(2)})">
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
        ${this.tooltip != null ? html`
          <div 
            class="chart__hover-line"
            style="transform: translateX(${this.tooltip.x}px); height: ${this.height}px;">
            ${this.tooltip.sets.map(subset => html`
              ${subset.map(point => html`
                <div
                  class="chart__line-circle"
                  style="
                    border-color: ${point.color};
                    transform: translateY(${(this.height - this.yScale*point.point.y).toFixed(1)}px);
                  ">
                </div>
              `)}
            `)}
            <div id="chart__tooltip">
              <span class="chart__tooltip-title">
                ${this.tooltip.sets[0][0].point.day}, ${this.tooltip.sets[0][0].point.date}
              </span>
              <div class="chart__tooltip-body">
                ${this.tooltip.sets.map(subset => html`
                  <div>
                    ${subset.map(point => html`
                      <div class="chart__tooltip-set">
                        <span style="color: ${point.color}">${point.point.y}</span>
                        <span style="color: ${point.color}">${point.name}</span>
                      </div>
                    `)}
                  </div>
                `)}
              </div>
            </div>
            
          </div>
        ` : null}
      `;
    } else {
      return html``;
    }
  }

  static get properties() {
    return {
      chart: Array,
      viewwidth: Number,
      viewoffset: Number,
      left: Number,
      width: Number,
      height: Number,
      xScale: Number,
      yScale: Number,
      yAxeScale: Number,
      tooltip: Number,
      hoveredI: Number,
      _xShift: Number,
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
    function defineDimensions() {
      const rect = this.getBoundingClientRect();
      this.left = rect.left;
      this.width = rect.width;
      this.height = rect.height-20;
      this.yScale = this.height/this._getMaxDataHeight();
      this.xScale = (this.width/this.viewwidth)/this._getDataWidth();
      this.yAxeScale = this._scaleShift(60/this.yScale, 0);
    }
    if (!this.offsetWidth || !this.offsetHeight) {
      this.style = 'display: block; height: 100%';
      setTimeout(defineDimensions.bind(this),0);
    } else {
      defineDimensions.call(this);
    }
  }

  _mouseMoveHandler(e) {
    this.hoveredI = this._getHoveredI(e.x);
  }

  get _touchMoveHandler() {
    return {
      handleEvent: function(e) {
        this.hoveredI = this._getHoveredI(e.touches[0].clientX);
      }.bind(this),
      passive: true
    }
  }

  _getHoveredI(x) {
    x = x - this.left;
    x -= this._xShift;
    x = Math.round(x/this.xScale)*this.xScale;
    return Math.round(x/this.xScale);
  }

  _updateTooltip(i) {
    if (i == null) {
      this.tooltip = null;
      return;
    }
    const x = i*this.xScale + this._xShift;
    if (x >= 0 && x <= this.width) {
      this.tooltip = {
        sets: this.chart
          .filter(set => set.visible)
          .map(set => Object.assign({}, set, {
            point: set.points[i]
          }))
          .reduce((res,set) => {
            let i = res.length-1;
            if (res[i].length < 2)
              res[i].push(set)
            else
              res.push([set])
            return res;
          }, [[]]),
        i,
        x: x.toFixed(2)
      };
    } else {
      this.tooltip = null;
    }
  }

  _computeYAxeMap() {
    const step = this.yAxeScale*this.yScale;
    let points = [];
    let i = 0;
    while(true) {
      let y = (this.height-step*i).toFixed(2);
      let text;
      if (y < 16) break;
      if (y > 20) { text = this._shortify(this.yAxeScale*i) }
      points.push({
        x: 0,
        y,
        text
      })
      i += 1;
    }
    return points;
  }

  _computeXAxeMap() {
    const TEXT_W = 48;
    const pow = Math.ceil(BASE_LOG(0.5, this.xScale/TEXT_W));
    const n = Math.pow(2,pow);
    const odd = (this.chart[0].points.length-1)%2;
    return this.chart[0].points.map((point,i,arr) => {
      let j = arr.length-i-2;
      let hidden = (j+odd)%n != 0;
      return {
        x: point.x*this.xScale,
        hidden,
        text: point.date
      }
    });
  }

  _computeYAxeScale(scale) {
    while(true) {
      let step = scale*this.yScale;
      if (step > 90)
        scale = this._scaleShift(scale, -1);
      else if (step < 35)
        scale = this._scaleShift(scale, 1);
      else
        break;
    }
    return scale;
  }

  _scaleShift(scale, shift) {
    const scales = [1,2,5];
    let pow10 = Math.pow(10, scale.toFixed().length-1);
    let oldI = scales.indexOf(scale/pow10);
    if (oldI == -1) {
      let dif = Infinity;
      oldI = scales.reduce((res,item, i) => {
        let newDif = Math.abs(item - scale/pow10);
        res = newDif < dif ? i : res;
        dif = newDif
        return res;
      }, -1);
    }
    let i = oldI+shift;
    if (i == -1) {
      pow10 *= 0.1;
      i = 2;
    } else if (i == 3) {
      pow10 *= 10;
      i = 0;
    }
    return scales[i]*pow10;
  }

  _shortify(n) {
    var exp = String(n).length-1;
    if (exp >= 9) 
      return n/Math.pow(10,9)+'B';
    else if (exp >= 6)
      return n/Math.pow(10,6)+'M';
    else if (exp >= 3)
      return n/Math.pow(10,3)+'K';
    else 
      return n;
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
    })(val => {
      this.yScale = val
    });
  }
}

customElements.define('t-main-chart-renderer', TMainChartRenderer);