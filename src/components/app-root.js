import { LitElement, html, css } from 'lit-element';
import chartData from '../data/chart-data.json';
import './t-chart-wrapper.js';

class AppRoot extends LitElement {
  static get styles() {
    return css`
      :host([theme="light"]) {
        --accent: #1676f4;
        --primary-text: #192434;
        --tertiary-text: hsla(214, 53%, 23%, 0.16);
        --overflow-background: hsla(210, 60%, 95%, 0.7);
        --overflow-border: hsla(216, 15%, 80%, 0.6);
        --background: #ffffff;
        --color-tr-duration: 0.3s;
      }
      :host([theme="dark"]) {
        --accent: #1676f4;
        --primary-text: hsla(0, 0%, 100%, 0.9);
        --tertiary-text: hsla(0, 0%, 100%, 0.3);
        --overflow-background: hsla(214, 29%, 14%, 0.7);
        --overflow-border: hsla(214, 20%, 50%, 0.5);
        --background: hsl(215, 27%, 19%);
        --color-tr-duration: 0.3s;
      }
      :host {
        display: flex;
        flex-direction: column;
        background-color: var(--background);
        transition: background-color var(--color-tr-duration);
        max-width: 40rem;
        margin: auto;
      }
      .app__theme-switch {
        margin: 1rem 0 2rem;
      }
    `;
  }

  render() {
    return html`
      ${this.charts.map((chart, i) => html`
        <t-chart-wrapper
          .chart=${chart}
          .title="Chart #${i+1}">
        </t-chart-wrapper>
      `)}
      <t-theme-switch
        .theme=${this.theme}
        @theme-changed=${this.themeChanged}
        class="app__theme-switch">
      </t-theme-switch>
    `
  }

  static get properties() {
    return {
      charts: Array,
      theme: {
        type: String,
        reflect: true
      }
    }
  }

  constructor() {
    super();
    this.theme = 'light';
    this.charts = this._parseRowData(chartData);
  }

  themeChanged(e) {
    this.theme = e.detail.value;
    switch(this.theme) {
      case 'light':
        document.body.style.backgroundColor = '#ffffff';
        break;
      case 'dark':
        document.body.style.backgroundColor = 'hsl(215, 27%, 19%)';
        break;
    }
  }

  _parseRowData(data) {
    const MONTHS_SHORT = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    return data.map(chart => {
      return chart.columns.slice(1).map(set => {
        let key = set[0];
        return {
          label: chart.names[key],
          color: chart.colors[key],
          visible: true,
          points: set.slice(1).map((val, i) => {
            let t = new Date(chart.columns[0][i+1]);
            return {
              x: i,
              y: val,
              label: `${MONTHS_SHORT[t.getMonth()]} ${t.getDate()}`,
            }
          })
        }
      });
    });
  }
}

customElements.define('app-root', AppRoot);