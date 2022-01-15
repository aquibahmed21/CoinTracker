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
  // doge1: {
  //   coin: "doge",
  //   pair: "usdt",
  //   qty: 25,
  //   price: 0.189,
  //   term: "long",
  // },
  // doge2: {
  //   coin: "doge",
  //   pair: "usdt",
  //   qty: 26,
  //   price: 0.189,
  //   term: "long",
  // },
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
  adas1: {
    coin: "ada",
    pair: "usdt",
    qty: 4,
    price: 1.26509,
    term: "short"
  },
  usdt: {
    coin: "usdt",
    pair: "inr",
    qty: 1.554896,
    price: 78.56,
    term: "short"
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
  }
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
