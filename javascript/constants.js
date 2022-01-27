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

  // dip buy


  celr1: {
    coin: "celr",
    pair: "usdt",
    qty: 90,
    price: 0.05618,
    term: "dip"
  },
  hbar1: {
    coin: "hbar",
    pair: "usdt",
    qty: 22.5,
    price: 0.2231,
    term: "dip"
  },
  celr1: {
    coin: "celr",
    pair: "usdt",
    qty: 95,
    price: 0.05329,
    term: "dip"
  },
  bttc1: {
    coin: "bttc",
    pair: "usdt",
    qty: 2450980,
    price: 0.00000204,
    term: "dip"
  },
  atom1: {
    coin: "atom",
    pair: "usdt",
    qty: 0.15,
    price: 34.73,
    term: "dip"
  },

  // yash
  sushi1: {
    coin: "sushi",
    pair: "inr",
    qty: 0.282,
    price: 355.8,
    term: "yash"
  },
  win1: {
    coin: "win",
    pair: "inr",
    qty: 4219,
    price: 0.0237,
    term: "yash"
  },
  fil1: {
    coin: "fil",
    pair: "inr",
    qty: 0.063,
    price: 1576.42,
    term: "yash"
  },

  sol4: {
    coin: "sol",
    pair: "inr",
    qty: 0.012,
    price: 8049.98,
    term: "yash"
  },
  wrx2: {
    coin: "wrx",
    pair: "inr",
    qty: 1.57656665,
    price: 60.17,
    term: "yash"
  },

  shib6: {
    coin: "shib",
    pair: "inr",
    qty: 119293,
    price: 0.001789,
    term: "yash"
  },
  shib7: {
    coin: "shib",
    pair: "inr",
    qty: 2235,
    price: 0.001616,
    term: "yash"
  },
  // yash

  // dip buy
  usdt: {
    coin: "usdt",
    pair: "inr",
    qty: 40.266831,
    price: 78.56,
    term: "base"
  },
  wrx1: {
    coin: "wrx",
    pair: "inr",
    qty:  0.08791895,
    price: 93.4,
    term: "commission"
  }
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
  shib7: {
    coin: "shib",
    pair: "inr",
    qty: 121527,
    buyPrice: 0.001616,
    soldPrice: 0.001716,
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

const  getTicker = async () =>
{
  let symbolArr = [ "usdtinr" ];
  Object.entries( JSONDATA ).filter( ( [ k, v ] ) => symbolArr.push( v.coin + v.pair ) );
  symbolArr = removeDuplicate( symbolArr );
  const allTicker = await baseFun( ticker24URL );
  return allTicker.filter( e => symbolArr.includes( e.symbol ) );
};

export { JSONDATA, SoldJSon, delay, baseFun, getTicker, fearGreed };
