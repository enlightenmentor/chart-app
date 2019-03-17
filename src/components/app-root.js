import { LitElement, html, css } from 'lit-element';
import chartData from '../data/chart-data.json';
import './t-chart-wrapper.js';

class AppRoot extends LitElement {
  static get styles() {
    return css`
      :host([theme="light"]) {
        --accent: #1676f4;
        --primary-text: #192434;
        --secondary-text: hsl(215, 12%, 70%);
        --tertiary-text: hsl(210, 20%, 94%);
        --overflow-background: hsla(210, 60%, 95%, 0.7);
        --overflow-border: hsla(216, 15%, 80%, 0.6);
        --border-color: hsla(214, 53%, 23%, 0.16);
        --shadow-color: #999;
        --background: #ffffff;
        --color-tr-duration: 0.3s;
      }
      :host([theme="dark"]) {
        --accent: #1676f4;
        --primary-text: hsla(0, 0%, 100%, 0.9);
        --secondary-text: hsl(213, 20%, 47%);
        --tertiary-text: hsl(214, 29%, 23%);
        --overflow-background: hsla(214, 29%, 14%, 0.7);
        --overflow-border: hsla(214, 20%, 50%, 0.5);
        --border-color: hsla(214, 64%, 82%, 0.23);
        --shadow-color: #111;
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
        @theme-changed=${e => this.themeChanged(e.detail.value)}
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
    this.themeChanged('dark');
    this.charts = this._parseRowData(chartData);
  }

  themeChanged(theme) {
    this.theme = theme;
    switch(theme) {
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
    const DAYS = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
    return data.map(chart => {
      return chart.columns.slice(1).map(set => {
        let key = set[0];
        return {
          name: chart.names[key],
          color: chart.colors[key],
          visible: true,
          points: set.slice(1).map((val, i) => {
            let t = new Date(chart.columns[0][i+1]);
            return {
              x: i,
              y: val,
              day: DAYS[t.getDay()],
              date: `${MONTHS_SHORT[t.getMonth()]} ${t.getDate()}`,
            }
          })
        }
      });
    });
  }
}

customElements.define('app-root', AppRoot);