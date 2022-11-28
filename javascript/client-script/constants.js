"use strict";

const ticker24URL = "https://api.wazirx.com/sapi/v1/tickers/24hr";

const delay = ( ms ) => new Promise( res => setTimeout( res, ms ) );

// const removeDuplicate = ( arr ) => arr.filter( ( item, pos ) => arr.indexOf( item ) === pos );

const fearGreed = async () => await baseFun( "https://api.alternative.me/fng/" );

const baseFun = ( url ) =>
  new Promise( ( res ) => {
    const xhr = new XMLHttpRequest();
    xhr.open( "GET", url );

    xhr.onreadystatechange = function () {
      if ( xhr.readyState === 4 ) return res( JSON.parse( xhr.responseText ) );
    };
    xhr.send();
  } );

const getTicker = async ( JSONDATA ) => {
  try {
    return await baseFun( ticker24URL );
  } catch ( e ) {
    return null;
  }
};

// Utils fetch functions
async function fetchUtils ( url, method, body = null ) {
  body = body ? JSON.stringify( body ) : null;
  try {
    const res_data = await fetch( url,
      {
        method: method,
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": localStorage.getItem( "token" ),
          user: localStorage.getItem( "uid" )
        },
        body: body
      } );
    return await res_data.json();
  } catch ( err ) {
    return { status: "invalid", msg: err };
  }
}

function GetDisplayTime ( timeSent ) {
  const CALENDAR_DAYS = [ "Sun", "Mon", "Tue", "Wed", "Thur", "Fri", "Sat" ];
  const CALENDAR_MONTHS =
    [ "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec" ];

  if ( timeSent === 0 )
    return "--";
  const dateTimeSent = new Date( timeSent );
  const date = new Date();
  const minutes = dateTimeSent.getMinutes();
  // REF: https://stackoverflow.com/questions/54741141/why-i-canot-get-the-same-result-using-the-getday-method-and-the-getutcday-me
  // let dayPart = CALENDAR_DAYS[dateTimeSent.getUTCDay()]; // dateTimeSent.getUTCDay() is giving 0(Sunday) instead of
  const dayPart = dateTimeSent.getHours() >= 0 && dateTimeSent.getHours() < 6 // minor work around to check if time +530GMT
    ? CALENDAR_DAYS[ dateTimeSent.getUTCDay() + 1 ] || CALENDAR_DAYS[ dateTimeSent.getDay() ]
    : CALENDAR_DAYS[ dateTimeSent.getUTCDay() ];
  //
  const dayMonthPart = CALENDAR_MONTHS[ dateTimeSent.getUTCMonth() ] + " " + dateTimeSent.getDate();
  const day = dateTimeSent.getUTCDate();
  const month = dateTimeSent.getUTCMonth() + 1;
  const year = dateTimeSent.getUTCFullYear().toLocaleString().substring( 3 );
  let time;
  const hours = dateTimeSent.getHours() % 12;
  // hours = !this.GetUserSettings().Is24Hour ? hours ? hours : 12 : dateTimeSent.getHours();
  // let am_pm = !this.GetUserSettings().Is24Hour ? dateTimeSent.getHours() >= 12 ? "pm" : "am" : "";
  const am_pm = dateTimeSent.getHours() >= 12 ? "pm" : "am";
  const actualTime = ( "00" + hours ).slice( -2 ) + ":" + ( "00" + minutes ).slice( -2 );
  // let timePart = !this.GetUserSettings().Is24Hour ? actualTime + " " + am_pm : actualTime;
  const timePart = actualTime + " " + am_pm;
  if ( dateTimeSent.getDate() > date.getDate() )
    time = dateTimeSent.getDate() - date.getDate();
  else
    time = date.getDate() - dateTimeSent.getDate();
  if ( dateTimeSent.getUTCFullYear() === new Date().getUTCFullYear() &&
    dateTimeSent.getUTCMonth() === new Date().getUTCMonth() &&
    dateTimeSent.getUTCDate() === new Date().getUTCDate() )
    return timePart;
  else if ( dateTimeSent.getUTCFullYear() === new Date().getUTCFullYear() &&
    dateTimeSent.getUTCMonth() === new Date().getUTCMonth() &&
    date.getUTCDate() - dateTimeSent.getDate() === 1 )
    return "Y'day" + ", " + timePart;
  else if ( dateTimeSent.getUTCFullYear() === new Date().getUTCFullYear() &&
    dateTimeSent.getUTCMonth() === new Date().getUTCMonth() &&
    dateTimeSent.getUTCDay() !== new Date().getUTCDay() && time <= 7 )
    return dayPart + ", " + timePart;
  // To check if it's same day/date
  else if ( dateTimeSent.getUTCFullYear() === date.getUTCFullYear() &&
    dateTimeSent.getMonth() === date.getMonth() &&
    dateTimeSent.getDate() === date.getDate() )
    return timePart;
  else if ( dateTimeSent.getUTCFullYear() === new Date().getUTCFullYear() )
    return dayMonthPart + ", " + timePart;
  else
  if ( month < 10 && day < 10 )
    return "0" + day + "/" + "0" + month + "/" + year + ", " + timePart;
  else if ( day < 10 )
    return "0" + day + "/" + month + "/" + year + ", " + timePart;
  else if ( month < 10 )
    return day + "/" + "0" + month + "/" + year + ", " + timePart;
  else
    return day + "/" + month + "/" + year + ", " + timePart;
}

export { delay, baseFun, getTicker, fearGreed, GetDisplayTime, fetchUtils };
