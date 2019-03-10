function randInt(n) {
  return Math.round((Math.random()*n));
}

function getCurrentYearDates() {
  const NOW = new Date();
  const TIMEZONE_OFFSET = NOW.getTimezoneOffset()*60*1000;
  const DAY_DURATION = 24*60*60*1000;
  const MONTHS_SHORT = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Now','Dec'];

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

export default function generateRandomData() {
  return randomFollowersForDates(getCurrentYearDates());
}