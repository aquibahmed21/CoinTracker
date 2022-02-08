"use strict";

const JSONDATA = {
  shib1: {
    coin: "shib",
    pair: "usdt",
    qty: 81059,
    price: 0.00003701,
    term: "long",
  },
  shib2: {
    coin: "shib",
    pair: "usdt",
    qty: 80256,
    price: 0.00003738,
    term: "long",
  },
  shib3: {
    coin: "shib",
    pair: "usdt",
    qty: 107008,
    price: 0.00003738,
    term: "long",
  },
  xrp1: {
    coin: "xrp",
    pair: "usdt",
    qty: 8.6,
    price: 0.922,
    term: "long",
  },
  xrp2: {
    coin: "xrp",
    pair: "usdt",
    qty: 3.2,
    price: 0.914,
    term: "long",
  },
  btc1: {
    coin: "btc",
    pair: "usdt",
    qty: 0.00008,
    price: 49950,
    term: "long",
  },
  btc2: {
    coin: "btc",
    pair: "usdt",
    qty: 0.00006,
    price: 49950,
    term: "long",
  },
  btc3: {
    coin: "btc",
    pair: "usdt",
    qty: 0.00006,
    price: 49717,
    term: "long",
  },
  dot1: {
    coin: "dot",
    pair: "usdt",
    qty: 0.1,
    price: 29,
    term: "long",
  },
  dot2: {
    coin: "dot",
    pair: "usdt",
    qty: 0.23,
    price: 29.41,
    term: "long",
  },
  ada1: {
    coin: "ada",
    pair: "usdt",
    qty: 2,
    price: 1.44,
    term: "long",
  },
  ada2: {
    coin: "ada",
    pair: "usdt",
    qty: 2.7,
    price: 1.44,
    term: "long",
  },
  ada3: {
    coin: "ada",
    pair: "usdt",
    qty: 2.1,
    price: 1.43,
    term: "long",
  },
  bnb1: {
    coin: "bnb",
    pair: "usdt",
    qty: 0.007,
    price: 543.21,
    term: "long",
  },
  bnb2: {
    coin: "bnb",
    pair: "usdt",
    qty: 0.009,
    price: 544,
    term: "long",
  },
  sol1: {
    coin: "sol",
    pair: "usdt",
    qty: 0.015,
    price: 194,
    term: "long",
  },
  sol2: {
    coin: "sol",
    pair: "usdt",
    qty: 0.015,
    price: 197,
    term: "long",
  },
  sol3: {
    coin: "sol",
    pair: "usdt",
    qty: 0.019,
    price: 197,
    term: "long",
  },
  eth1: {
    coin: "eth",
    pair: "usdt",
    qty: 0.0006,
    price: 4038.92,
    term: "long",
  },
  eth2: {
    coin: "eth",
    pair: "usdt",
    qty: 0.0006,
    price: 4038.92,
    term: "long",
  },
  eth3: {
    coin: "eth",
    pair: "usdt",
    qty: 0.0009,
    price: 4038.92,
    term: "long",
  },
  shibs2: {
    coin: "shib",
    pair: "usdt",
    qty: 152532,
    price: 0.00003278,
    term: "short"
  },
  dots1: {
    coin: "dot",
    pair: "usdt",
    qty: 0.33,
    price: 29.48,
    term: "short"
  },
  nkns1: {
    coin: "nkn",
    pair: "usdt",
    qty: 12.8,
    price: 0.39,
    term: "short"
  },
  ltcs1: {
    coin: "ltc",
    pair: "usdt",
    qty: 0.064,
    price: 156.19,
    term: "short"
  },
  xrps1: {
    coin: "xrp",
    pair: "inr",
    qty: 6.9,
    price: 72.4307,
    term: "short"
  },
  wins1: {
    coin: "win",
    pair: "inr",
    qty: 7971,
    price: 0.0376,
    term: "short"
  },
  dents1: {
    coin: "dent",
    pair: "inr",
    qty: 1461,
    price: 0.342,
    term: "short"
  },
  dents2: {
    coin: "dent",
    pair: "usdt",
    qty: 1355,
    price: 0.00369,
    term: "short"
  },
  matics1: {
    coin: "matic",
    pair: "usdt",
    qty: 2.5,
    price: 2.33972,
    term: "short"
  },
  doge1: {
    coin: "doge",
    pair: "usdt",
    qty: 41,
    price: 0.1703671,
    term: "long"
  },

  //! dip buy


  atom1: {
    coin: "atom",
    pair: "usdt",
    qty: 0.15,
    price: 34.73,
    term: "dip"
  },

  mana2: {
    coin: "mana",
    pair: "usdt",
    qty: 1.7,
    price: 3.12,
    term: "dip"
  },

  ftm3: {
    coin: "ftm",
    pair: "usdt",
    qty: 2.3,
    price: 2.2,
    term: "dip"
  },

  hnt1: {
    coin: "hnt",
    pair: "usdt",
    qty: 0.105,
    price: 28.790,
    term: "dip"
  },

  atom3: {
    coin: "atom",
    pair: "usdt",
    qty: 0.12,
    price: 30.3,
    term: "dip"
  },

  mana3: {
    coin: "mana",
    pair: "usdt",
    qty: 1.7,
    price: 2.98,
    term: "buy-order"
  },

  avax1: {
    coin: "avax",
    pair: "usdt",
    qty: 0.06,
    price: 77.91,
    term: "buy-order"
  },

  luna3: {
    coin: "luna",
    pair: "usdt",
    qty: 0.1,
    price: 55.8,
    term: "dip"
  },

  enj4: {
    coin: "enj",
    pair: "usdt",
    qty: 2.8,
    price: 1.8,
    term: "buy-order"
  },

  ada5: {
    coin: "ada",
    pair: "usdt",
    qty: 4.5,
    price: 1.13,
    term: "buy-order"
  },

  celr2: {
    coin: "celr",
    pair: "usdt",
    qty: 100,
    price: 0.05504,
    term: "dip"
  },

  coti4: {
    coin: "coti",
    pair: "usdt",
    qty: 16.5,
    price: 0.3041,
    term: "dip"
  },

  doge4: {
    coin: "doge",
    pair: "usdt",
    qty: 26,
    price: 0.1561978,
    term: "dip"
  },

  hbar4: {
    coin: "hbar",
    pair: "usdt",
    qty: 40.6,
    price: 0.2464,
    term: "dip"
  },

  //? yash

  wrx2: {
    coin: "wrx",
    pair: "usdt",
    qty: 2.07233829,
    price: 0.98714,
    term: "commission-y"
  },

  coti5: {
    coin: "coti",
    pair: "inr",
    qty: 6.2,
    price: 23.998,
    term: "yash"
  },

  hbar5: {
    coin: "hbar",
    pair: "inr",
    qty: 10.4,
    price: 19.22976,
    term: "yash"
  },

  doge6:  {
    coin: "doge",
    pair: "inr",
    qty: 8,
    price: 12.2054,
    term: "yash"
  },

  gala4:  {
    coin: "gala",
    pair: "inr",
    qty: 7,
    price: 25.8,
    term: "yash"
  },

  mana4:  {
    coin: "mana",
    pair: "inr",
    qty: 0.7,
    price: 251.5999,
    term: "yash"
  },

  celr4:  {
    coin: "celr",
    pair: "inr",
    qty: 46,
    price: 4.2974,
    term: "yash"
  },

  win3: {
    coin: "win",
    pair: "inr",
    qty: 3663,
    price: 0.0273,
    term: "yash"
  },

  reef4:  {
    coin: "reef",
    pair: "inr",
    qty: 106,
    price: 0.941,
    term: "yash"
  },

  //? yash

  //! dip buy

  wrx5: {
    coin: "wrx",
    pair: "usdt",
    qty: 2.12993662,
    price: 0.92799,
    term: "commission"
  },
  usdt: {
    coin: "usdt",
    pair: "inr",
    qty: 57.15141,
    price: 78.56,
    term: "base"
  },
};


const SoldJSon = {
  shib1: {
    coin: "shib",
    pair: "usdt",
    qty: 165837,
    buyPrice: 0.00003015,
    soldPrice: 0.00003184,
    term: "short"
  },
  doge1: {
    coin: "doge",
    pair: "usdt",
    qty: 51,
    buyPrice: 0.189,
    soldPrice: 0.199899,
    term: "long"
  },
  adas1: {
    coin: "ada",
    pair: "usdt",
    qty: 4,
    buyPrice: 1.26509,
    soldPrice: 1.36000,
    term: "short"
  },
  shib4: {
    coin: "shib",
    pair: "usdt",
    qty: 245363,
    buyPrice: 0.00001886,
    soldPrice: 0.0000223,
    term: "dip"
  },
  shib5: {
    coin: "shib",
    pair: "inr",
    qty: 71428,
    buyPrice: 0.0014,
    soldPrice: 0.001835,
    term: "yash"
  },
  doge3: {
    coin: "doge",
    pair: "usdt",
    qty: 40,
    buyPrice: 0.131396,
    soldPrice: 0.1386620,
    term: "dip"
  },
  doge4: {
    coin: "doge",
    pair: "inr",
    qty: 10,
    buyPrice: 10.31,
    soldPrice: 11.31,
    term: "yash"
  },
  chr1: {
    coin: "chr",
    pair: "usdt",
    qty: 10,
    buyPrice: 0.5067,
    soldPrice: 0.5297,
    term: "dip"
  },
  dot3: {
    coin: "dot",
    pair: "usdt",
    qty: 0.3,
    buyPrice: 17.59,
    soldPrice: 18.56,
    term: "dip"
  },
  bnb3: {
    coin: "bnb",
    pair: "usdt",
    qty: 0.015,
    buyPrice: 352,
    soldPrice: 378,
    term: "dip"
  },
  btc4: {
    coin: "btc",
    pair: "usdt",
    qty: 0.00015,
    buyPrice: 35311,
    soldPrice: 37031,
    term: "dip"
  },
  xrp3: {
    coin: "xrp",
    pair: "usdt",
    qty: 8.5,
    buyPrice: 0.595,
    soldPrice: 0.62953,
    term: "dip"
  },
  wrx3: {
    coin: "wrx",
    pair: "usdt",
    qty: 7.1,
    buyPrice: 0.77441,
    soldPrice: 0.81992,
    term: "dip"
  },
  gala1: {
    coin: "gala",
    pair: "inr",
    qty: 6,
    buyPrice: 14.3,
    soldPrice: 16.7649,
    term: "yash"
  },
  mana1: {
    coin: "mana",
    pair: "inr",
    qty: 0.6,
    buyPrice: 158,
    soldPrice: 179.5599,
    term: "yash"
  },
  enj1: {
    coin: "enj",
    pair: "inr",
    qty: 1,
    buyPrice: 122.65,
    soldPrice: 128.6081,
    term: "yash"
  },

  dent3: {
    coin: "dent",
    pair: "usdt",
    qty: 1990,
    buyPrice: 0.002515,
    soldPrice: 0.002646,
    term: "dip"
  },
  eth4: {
    coin: "eth",
    pair: "usdt",
    qty: 0.002,
    buyPrice: 2450,
    soldPrice: 2647.75,
    term: "dip"
  },
  shib7: {
    coin: "shib",
    pair: "inr",
    qty: 121527,
    buyPrice: 0.001616,
    soldPrice: 0.001716,
    term: "yash"
  },
  ada4: {
    coin: "ada",
    pair: "usdt",
    qty: 5,
    buyPrice: 1.04004,
    soldPrice: 1.12,
    term: "dip"
  },
  coti1: {
    coin: "coti",
    pair: "usdt",
    qty: 20,
    buyPrice: 0.2606,
    soldPrice: 0.27999,
    term: "dip"
  },
  win1: {
    coin: "win",
    pair: "inr",
    qty: 4219,
    buyPrice: 0.0237,
    soldPrice: 0.0248,
    term: "yash"
  },
  wrx2: {
    coin: "wrx",
    pair: "inr",
    qty: 1.5,
    buyPrice: 60.17,
    soldPrice: 67.17,
    term: "yash"
  },
  pha1: {
    coin: "pha",
    pair: "inr",
    qty: 5.03,
    buyPrice: 19.875,
    soldPrice: 19.694,
    term: "yash"
  },
  hbar2: {
    coin: "hbar",
    pair: "inr",
    qty: 11.5,
    buyPrice: 16.99464,
    soldPrice: 17.51669,
    term: "yash"
  },
  xec: {
    coin: "xec",
    pair: "inr",
    qty: 30247,
    buyPrice: 0.0057943,
    soldPrice: 0.0061544,
    term: "yash"
  },
  reef1: {
    coin: "reef",
    pair: "inr",
    qty: 288,
    buyPrice: 0.8022,
    soldPrice: 0.8261,
    term: "yash"
  },
  gala2: {
    coin: "gala",
    pair: "inr",
    qty: 7,
    buyPrice: 15.85,
    soldPrice: 16.2071,
    term: "yash"
  },
  fil1: {
    coin: "fil",
    pair: "inr",
    qty: 0.063,
    buyPrice: 1576.42,
    soldPrice: 1658.15,
    term: "yash"
  },
  bttc1: {
    coin: "bttc",
    pair: "usdt",
    qty: 2450980,
    buyPrice: 0.00000204,
    soldPrice: 0.00000211,
    term: "dip"
  },
  coti3: {
    coin: "coti",
    pair: "inr",
    qty: 8,
    buyPrice: 25.088,
    soldPrice: 26.311,
    term: "yash"
  },
  ftm2: {
    coin: "ftm",
    pair: "usdt",
    qty: 1.5,
    buyPrice: 2.018,
    soldPrice: 2.0783,
    term: "dip"
  },

  ada6: {
    coin: "ada",
    pair: "usdt",
    qty: 3,
    buyPrice: 1.02,
    soldPrice: 1.04582,
    term: "dip"
  },
  luna1: {
    coin: "luna",
    pair: "usdt",
    qty: 0.1,
    buyPrice: 50.7,
    soldPrice: 53.9,
    term: "dip"
  },
  hbar1: {
    coin: "hbar",
    pair: "usdt",
    qty: 22.5,
    buyPrice: 0.2231,
    soldPrice: 0.2309,
    term: "dip"
  },
  sol4: {
    coin: "sol",
    pair: "inr",
    qty: 0.012,
    buyPrice: 8049.98,
    soldPrice: 8462.98,
    term: "yash"
  },

  luna2: {
    coin: "luna",
    pair: "inr",
    qty: 0.04,
    buyPrice: 4075.99,
    soldPrice: 4245.32,
    term: "yash"
  },

  wrx1: {
    coin: "wrx",
    pair: "usdt",
    qty:  2.01398069,
    buyPrice: 0.80299,
    soldPrice: 1.06084,
    term: "commission"
  },

  wrx4: {
    coin: "wrx",
    pair: "inr",
    qty: 2.2,
    buyPrice: 87.45,
    soldPrice: 83.01,
    term: "yash"
  },
  bttc2: {
    coin: "bttc",
    pair: "inr",
    qty: 602410,
    buyPrice: 0.000166,
    soldPrice: 0.0001727,
    term: "yash"
  },
  win2: {
    coin: "win",
    pair: "usdt",
    qty: 32450,
    buyPrice: 0.0003082,
    soldPrice: 0.0003088,
    term: "dip"
  },
  coti4: {
    coin: "coti",
    pair: "inr",
    qty: 11.2,
    buyPrice: 24.997,
    soldPrice: 25.0001,
    term: "yash"
  },

  enj3: {
    coin: "enj",
    pair: "usdt",
    qty: 3.1,
    buyPrice: 1.663,
    soldPrice: 1.725,
    term: "dip"
  },
  lrc3 : {
    coin: "lrc",
    pair: "usdt",
    qty: 6,
    buyPrice: 0.8431,
    soldPrice: 0.88145,
    term: "dip"
  },
  dent4: {
    coin: "dent",
    pair: "usdt",
    qty: 2000,
    buyPrice: 0.002501,
    soldPrice: 0.00262,
    term: "dip"
  },
  doge5: {
    coin: "doge",
    pair: "usdt",
    qty: 36,
    buyPrice: 0.1373723,
    soldPrice: 0.1409983,
    term: "dip"
  },
  link1: {
    coin: "link",
    pair: "usdt",
    qty: 0.32,
    buyPrice: 15.84,
    soldPrice: 16.2,
    term: "dip"
  },
  matic1: {
    coin: "matic",
    pair: "usdt",
    qty: 3.3,
    buyPrice: 1.51403,
    soldPrice: 1.58397,
    term: "dip"
  },

  doge2: {
    coin: "doge",
    pair: "usdt",
    qty: 35,
    buyPrice: 0.1432999,
    soldPrice: 0.1464816,
    term: "long-ordered"
  },
  enj2: {
    coin: "enj",
    pair: "usdt",
    qty: 3,
    buyPrice: 1.73,
    soldPrice: 1.792,
    term: "dip"
  },
  celr1: {
    coin: "celr",
    pair: "usdt",
    qty: 95,
    buyPrice: 0.05329,
    soldPrice: 0.05559,
    term: "dip"
  },
  coti5: {
    coin: "coti",
    pair: "usdt",
    qty: 16,
    buyPrice: 0.3151,
    soldPrice: 0.31858,
    term: "dip"
  },
  lrc1: {
    coin: "lrc",
    pair: "usdt",
    qty: 5,
    buyPrice: 0.9122,
    soldPrice: 0.9402,
    term: "dip"
  },
  celr1: {
    coin: "celr",
    pair: "usdt",
    qty: 90,
    buyPrice: 0.05618,
    soldPrice: 0.05997,
    term: "dip"
  },
  atom2: {
    coin: "atom",
    pair: "inr",
    qty: 0.08,
    buyPrice: 2331.98,
    soldPrice: 2390.00,
    term: "yash"
  },
  gala3: {
    coin: "gala",
    pair: "inr",
    qty: 5,
    buyPrice: 14.8,
    soldPrice: 15.4148,
    term: "yash"
  },
  hot1: {
    coin: "hot",
    pair: "inr",
    qty: 271,
    buyPrice: 0.368,
    soldPrice: 0.383,
    term: "yash"
  },
  shib7: {
    coin: "shib",
    pair: "inr",
    qty: 2235,
    buyPrice: 0.001616,
    soldPrice: 0.001793,
    term: "yash"
  },
  sushi1: {
    coin: "sushi",
    pair: "inr",
    qty: 0.282,
    buyPrice: 355.8,
    soldPrice: 365.27,
    term: "yash"
  },
  front1: {
    coin: "front",
    pair: "inr",
    qty: 4.91,
    buyPrice: 40.619,
    soldPrice: 40.34,
    term: "yash"
  },
  wrx6: {
    coin: "wrx",
    pair: "inr",
    qty: 1.2,
    buyPrice: 76.6,
    soldPrice: 76.6,
    term: "yash"
  },
  shib6: {
    coin: "shib",
    pair: "inr",
    qty: 119293,
    buyPrice: 0.001789,
    soldPrice: 0.001793,
    term: "yash"
  },
  ftm3: {
    coin: "ftm",
    pair: "inr",
    qty: 0.6,
    buyPrice: 172.156,
    soldPrice: 164.2,
    term: "yash"
  },
  push1: {
    coin: "push",
    pair: "inr",
    qty: 2.45,
    buyPrice: 101.875,
    soldPrice: 101.311,
    term: "yash"
  },
  lrc2: {
    coin: "lrc",
    pair: "inr",
    qty: 2.6,
    buyPrice: 74.99915,
    soldPrice: 76.49998,
    term: "yash"
  },
  busd1: {
    coin: "busd",
    pair: "inr",
    qty: 2.56,
    buyPrice: 77.75,
    soldPrice: 77.75,
    term: "yash"
  },
  usdt2: {
    coin: "usdt",
    pair: "inr",
    qty: 16.487048,
    buyPrice: 77.85,
    soldPrice: 78.59,
    term: "base-y"
  },
};

const ticker24URL = "https://api.wazirx.com/sapi/v1/tickers/24hr";

const delay = ( ms ) => new Promise( ( res ) => setTimeout( res, ms ) );

const removeDuplicate = ( arr ) => arr.filter( ( item, pos ) => arr.indexOf( item ) == pos );

const fearGreed = async () => await baseFun( "https://api.alternative.me/fng/" );

const baseFun = (url) =>
  new Promise((res) => {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", url);

    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) return res(JSON.parse(xhr.responseText));
    };
    xhr.send();
  } );

const getTicker = async () =>
{
  try
  {
    let symbolArr = [ "usdtinr" ];
    Object.entries( JSONDATA ).filter( ( [ k, v ] ) => symbolArr.push( v.coin + v.pair ) );
    symbolArr = removeDuplicate( symbolArr );
    const allTicker = await baseFun( ticker24URL );
    return allTicker.filter( e => symbolArr.includes( e.symbol ) );
  }
  catch ( e )
  {
    console.log( e );
    return null;
  }
};

function GetDisplayTime (timeSent)
{
  const CALENDAR_DAYS = ["Sun","Mon", "Tue", "Wed", "Thur", "Fri", "Sat"];
  const CALENDAR_MONTHS =
          ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  if(timeSent == 0)
    return "--";
  let dateTimeSent= new Date(timeSent);
  let date= new Date();
  let minutes = dateTimeSent.getMinutes();
  // REF: https://stackoverflow.com/questions/54741141/why-i-canot-get-the-same-result-using-the-getday-method-and-the-getutcday-me
  // let dayPart = CALENDAR_DAYS[dateTimeSent.getUTCDay()]; // dateTimeSent.getUTCDay() is giving 0(Sunday) instead of
  let dayPart = dateTimeSent.getHours() >= 0 && dateTimeSent.getHours() < 6 ? // minor work around to check if time +530GMT
                        CALENDAR_DAYS[dateTimeSent.getUTCDay() + 1] ||  CALENDAR_DAYS[dateTimeSent.getDay()]:
                        CALENDAR_DAYS[dateTimeSent.getUTCDay()];
  //
  let dayMonthPart = CALENDAR_MONTHS[dateTimeSent.getUTCMonth()] + " " + dateTimeSent.getDate();
  let day = dateTimeSent.getUTCDate();
  let month = dateTimeSent.getUTCMonth() + 1;
  let year = dateTimeSent.getUTCFullYear().toLocaleString().substring(3);
  let time;
  let hours =  dateTimeSent.getHours() % 12;
  // hours = !this.GetUserSettings().Is24Hour ? hours ? hours : 12 : dateTimeSent.getHours();
  // let am_pm = !this.GetUserSettings().Is24Hour ? dateTimeSent.getHours() >= 12 ? "pm" : "am" : "";
  let am_pm = dateTimeSent.getHours() >= 12 ? "pm" : "am";
  let actualTime = ("00" + hours).slice(-2) + ":" + ("00" + minutes).slice(-2);
  // let timePart = !this.GetUserSettings().Is24Hour ? actualTime + " " + am_pm : actualTime;
  let timePart = actualTime + " " + am_pm;
  if(dateTimeSent.getDate() > date.getDate())
    time = dateTimeSent.getDate() - date.getDate();
  else
    time = date.getDate() - dateTimeSent.getDate();
  if(dateTimeSent.getUTCFullYear() == new Date().getUTCFullYear() &&
      dateTimeSent.getUTCMonth() == new Date().getUTCMonth() &&
        dateTimeSent.getUTCDate() == new Date().getUTCDate())
    return timePart;
  else  if(dateTimeSent.getUTCFullYear() == new Date().getUTCFullYear() &&
            dateTimeSent.getUTCMonth() == new Date().getUTCMonth() &&
              date.getUTCDate() -  dateTimeSent.getDate() == 1)
  return "Y'day" + ", " + timePart;
  else if(dateTimeSent.getUTCFullYear() == new Date().getUTCFullYear() &&
            dateTimeSent.getUTCMonth() == new Date().getUTCMonth() &&
              dateTimeSent.getUTCDay() != new Date().getUTCDay() && time <= 7)
    return dayPart + ", " + timePart;
  // To check if it's same day/date
  else if (dateTimeSent.getUTCFullYear() == date.getUTCFullYear() &&
           dateTimeSent.getMonth() == date.getMonth() &&
           dateTimeSent.getDate() == date.getDate())
    return timePart;
  else if(dateTimeSent.getUTCFullYear() == new Date().getUTCFullYear())
    return dayMonthPart + ", " + timePart;
  else
  {
    if(month < 10 && day < 10)
      return "0" + day + "/" + "0" + month + "/" + year + ", " + timePart;
    else if(day < 10)
      return "0" + day + "/" + month + "/" + year + ", " + timePart;
    else if (month < 10)
      return day + "/" + "0" + month + "/" + year + ", " + timePart;
    else
      return day + "/" + month + "/" + year + ", " + timePart;
  }
}

export { JSONDATA, SoldJSon, delay, baseFun, getTicker, fearGreed, GetDisplayTime };
