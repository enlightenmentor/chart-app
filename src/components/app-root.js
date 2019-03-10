import { LitElement, html, css } from 'lit-element';
import './t-radio-button.js';

function generateRandomData() {
  function randInt(n) {
    return Math.round((Math.random()*n));
  }

  function getCurrentYearDates() {
    const NOW = new Date();
    const TIMEZONE_OFFSET = NOW.getTimezoneOffset()*60*1000;
    const DAY_DURATION = 24*60*60*1000;
    const MONTHS_SHORT = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Now","Dec"];

    let currentYear = NOW.getFullYear().toString();
    let yearTimestamp = new Date(currentYear).getTime()+TIMEZONE_OFFSET;
    let daysLength = Math.floor((NOW.getTime()-yearTimestamp) / DAY_DURATION);

    return new Array(daysLength).fill({}).map((day, i) => {
      let date = new Date(yearTimestamp + i*DAY_DURATION);
      return `${MONTHS_SHORT[date.getMonth()]} ${date.getDate()}`;
    });
  }

  function randomFollowersForDates(dates, max) {
    return dates.map(date => {
      return {
        date,
        joined: randInt(250),
        left: randInt(100)
      }
    });
  }

  return randomFollowersForDates(getCurrentYearDates());
}

class AppRoot extends LitElement {
  static get styles() {
    return css`
      :host {
        --green: #3cc23f;
        --red: #f34c44;
      }
      :host { display: block }
      .app__title {
        padding: 1rem;
        margin: 0;
      }
      .app__actions {
        display: flex;
        padding: 1rem;
      }
      .app__joined-button {
        --radio-button-color: var(--green);
        margin-right: 1rem;
      }
      .app__left-button {
        --radio-button-color: var(--red);
      }
    `;
  }

  render() {
    return html`
      <h3 class="app__title">Followers</h3>
      <div class="app__actions">
        <t-radio-button class="app__joined-button" checked>Joined</t-radio-button>
        <t-radio-button class="app__left-button" checked>Left</t-radio-button>
      </div>
    `
  }

  static get properties() {
    return {
      data: Object
    }
  }

  constructor() {
    super();
    this.data = generateRandomData();
  }
}

customElements.define('app-root', AppRoot);