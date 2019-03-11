import { LitElement, html, css, svg } from 'lit-element';

class TChartViewport extends LitElement {
  static get styles() {
    return css`
      :host {
        display: block;
        position: relative;
      }
    `;
  }

  render() {
    return html`
      <div id="leftOverflow"></div>
      <div id="window"></div>
      <div id="rightOverflow"></div>
    `;
  }

  static get properties() {
    return {
      width: {
        type: String,
        reflect: true
      },
      offset: {
        type: String,
        reflect: true
      }
    }
  }
}

customElements.define('t-chart-viewport', TChartViewport);