import { LitElement, html } from 'lit-element';

class ChartApp extends LitElement {
  // createRenderRoot() {
  //   return this;
  // }

  render() {
    return html`<div>Chart goes Here</div>`
  }
}

customElements.define('chart-app', ChartApp);