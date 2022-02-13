"use strict";

import * as Const from "./constants.js";
import * as webSocket from "./websocket.js";
// import * as history from "./jsonformatter.js";

// javascript enums
const Side = {
  SELL: "sell",
  BUY: "buy"
};

const Type = {
  LIMIT: "limit",
  STOP_LIMIT: "stop_limit"
};

const Method = {
  GET: "GET",
  POST: "POST",
  PUT: "PUT",
  DELETE: "DELETE"
};

const Routes = {
  AUTH_GET: "/api/auth",
  ORDER_POST: "/api/order",
  HODLING_POST: "/api/hodling",
  PL_LIST_POST: "/api/pllist",
  FUNDS_GET: "/api/funds",
  ALL_ORDER_GET: "/api/allOrders",
};


const PORT = 3000;
let PL_LIST = Const.SoldJSon;
let HODLING = Const.JSONDATA;

window.addEventListener( "load", async () =>
{
  const token = localStorage.getItem( "token" );
  if ( token ) {
    const res_data = await Const.fetchUtils( Routes.AUTH_GET, Method.GET );
    if ( res_data && res_data.status === "success" )
      localStorage.setItem( "uid", res_data.user._id );

    if ( location.port && location.port == PORT ) {
      PL_LIST = await Const.fetchUtils( Routes.PL_LIST_POST, Method.GET );
      PL_LIST = PL_LIST.message;
      HODLING = await Const.fetchUtils( Routes.HODLING_POST, Method.GET );
      HODLING = HODLING.message;
    }
  }
} );


const arr = [];

const hodlingTable = document.getElementById( "table" );
const hodlingBody = hodlingTable.getElementsByTagName( "tbody" );

const plTable = hodlingTable.nextElementSibling;
const plBody = plTable.getElementsByTagName( "tbody" );

const notificationBTN = document.getElementById( "notif" );
const caption = hodlingTable.getElementsByTagName( "caption" )[ 0 ];
const coinDetailsPopup = document.getElementsByClassName( "signup-container" )[ 0 ];

const arrTicker = await Const.getTicker() || await Const.getTicker();

function ShowNotification ( content )
{
  notificationBTN.innerHTML = content;
  notificationBTN.classList.add( "visible" );
}

if ( !arrTicker )
  window.alert( "Error: No ticker found, Please refresh.." );

let usdtinr = arrTicker.filter( e => e.symbol == ( "usdtinr" ) )[ 0 ].lastPrice;

await AddHodlingRows_FromJSON( HODLING );
await AddPLRows_FromJSON( PL_LIST );
SummationPLTable( hodlingBody );
SummationPLTable( plBody );
webSocket.wsSubscribe( LiveUpdateHodlingTable );
// AddAllHistory_FromDB( history.aquibHistory );

hodlingBody[ 0 ].addEventListener( "click", OnClick_HodlingRows() );
hodlingBody[ 0 ].addEventListener( "dblclick", OnDBClick_HodlingRows() );

window.onanimationend = async ( e ) =>
{
  // stacksnippet"s console also has CSS animations...
  if ( e.type === "animationend" && e.target.id == notificationBTN.id ) {
    await Const.delay( 11000 );
    notificationBTN.classList.remove( "visible" );
  }
};

document.addEventListener( "long-press", async function ( e )
{
  // https://github.com/john-doherty/long-press-event
  // stop the event from bubbling up
  e.preventDefault();

  const targetRow = e.target.tagName == "TD" ? e.target.parentElement : e.target;


  if ( targetRow.tagName !== "TR" )
    return;

  const coinpair = targetRow.children[ 0 ].textContent.trim();
  const side = Side.SELL; //Enum
  const qty = targetRow.children[ 2 ].textContent;
  const currentPrice = targetRow.children[ 5 ].textContent.split( " " )[ 0 ];
  const type = Type.LIMIT; //Enum
  const body = { coinpair, side, qty, currentPrice, type, side };
  const response = await Const.fetchUtils( Routes.ORDER_POST, Method.POST, body );
  console.log( response.msg );
} );



coinDetailsPopup.addEventListener( "click", async ( event ) =>
{
  const target = event.target;
  switch ( target.id ) {
    case "back":
      {
        ResetForm();
        coinDetailsPopup.classList.add( "Util_hide" );
      }
      break;
    case "next":
      {
        const uid = document.getElementsByTagName( "body" )[ 0 ].getAttribute( "uid" );
        const coin = coinDetailsPopup.querySelector( "#pets-name" ).value;
        const pair = coinDetailsPopup.querySelector( "[checked]" )?.value || "usdt";
        const qty = +coinDetailsPopup.querySelector( "#pets-breed" ).value;
        const price = +coinDetailsPopup.querySelector( "#pets-birthday" ).value;
        const term = coinDetailsPopup.querySelector( "#divCommentTerm" ).textContent;
        if ( !uid || !coin || !pair || !qty || !price ) {
          const content = `<p>Please fill all the fields</p>`;
          return ShowNotification( content );
        }
        else {
          coinDetailsPopup.classList.add( "Util_hide" );
          ResetForm();
        }
        const body = { coin, pair, qty, price, term, uid };
        const response = await Const.fetchUtils( Routes.HODLING_POST, Method.POST, body );
        console.log( response.msg );
      }
  }

  function ResetForm ()
  {
    coinDetailsPopup.querySelector( "#pets-name" ).value = "";
    coinDetailsPopup.querySelector( "#pets-breed" ).value = "";
    coinDetailsPopup.querySelector( "#pets-birthday" ).value = "";
    coinDetailsPopup.querySelector( "#divCommentTerm" ).textContent = "";
    coinDetailsPopup.querySelector( "[checked]" )?.removeAttribute( "checked" );
    coinDetailsPopup.querySelector( "#pet-gender-female" ).checked = true;
  }
},

  caption.addEventListener( "click", () =>
  {
    coinDetailsPopup.classList.remove( "Util_hide" );
    coinDetailsPopup.querySelector( "#pets-name" ).focus();
  } ) );

function AddAllHistory_FromDB ( history )
{
  const hodlingTable = document.getElementById( "tableHistory" );
  const hodlingBody = hodlingTable.getElementsByTagName( "tbody" );
  for ( let loop of history )
    for ( let coin of loop ) {
      const { id, symbol, type, side, status, price, origQty, createdTime } = coin;
      const row = document.getElementById( "historyRow" ).content.cloneNode( true );
      const isINR = symbol.endsWith( "inr" );
      row.querySelector( "#symbol" ).textContent = symbol;
      row.querySelector( "#price" ).textContent = price;
      row.querySelector( "#qty" ).textContent = origQty;
      row.querySelector( "#type" ).textContent = type;
      row.querySelector( "#side" ).textContent = side;
      row.querySelector( "#status" ).textContent = status;
      row.querySelector( "#createdTime" ).textContent = Const.GetDisplayTime( createdTime );
      row.querySelector( "#totalPrice" ).textContent = ( price * origQty ).toFixed( 2 ) + ( isINR ? " ₹" : " ₿" );
      hodlingBody[ 0 ].appendChild( row );

    }

}

function OnDBClick_HodlingRows ()
{
  return ( event ) =>
  {
    const targetRow = event.target.tagName == "TD" ? event.target.parentElement : event.target;

    if ( targetRow.tagName !== "TR" )
      return;

    const countDecimals = ( value ) =>
    {
      if ( ( value % 1 ) != 0 )
        return value.toString().split( "." )[ 1 ].length;
      return 0;
    };

    const getStopLossValue = ( price, percentage, decimal = 1 ) =>
      ( price - ( ( price * percentage ) / 100 ) ).toFixed( decimal );

    const buyPrice = +targetRow.children[ 1 ].textContent;
    const currentPrice = +targetRow.children[ 5 ].textContent.split( " " )[ 0 ];
    const countNumber = +countDecimals( buyPrice );
    const margin = +targetRow.children[ 10 ].textContent.split( " " )[ 0 ];
    const content = `<p>Trigger Value at ${ getStopLossValue( currentPrice, 2, countNumber ) } <br />
    Sale Value at ${ getStopLossValue( currentPrice, 4, countNumber ) } <br />
    You get ${ getStopLossValue( margin, 4, countNumber ) } ₹</p>`;

    ShowNotification( content );
  };
}

function OnClick_HodlingRows ()
{
  return ( event ) =>
  {
    const targetRow = event.target.tagName == "TD" ? event.target.parentElement : event.target;
    const targetID = targetRow.id;

    if ( targetRow.tagName !== "TR" )
      return;

    const existingRow = hodlingBody[ 0 ].querySelector( ".rowSelect" );
    if ( existingRow ) {
      if ( existingRow.id == targetID )
        existingRow.classList.remove( "rowSelect" );
      else {
        existingRow.classList.remove( "rowSelect" );
        targetRow.classList.add( "rowSelect" );
      }
    }
    else
      targetRow.classList.add( "rowSelect" );
  };
}

function SummationPLTable ( body )
{
  const children = body[ 0 ].children;
  const footChild = body[ 0 ].nextElementSibling.children[ 0 ].children;

  let beforeDollar = 0, beforeInr = 0, percentage = 0, afterDollar = 0, afterInr = 0, portFolio = 0;

  for ( let child of children ) {
    beforeDollar += +child.querySelector( "#tdTotalDollar" ).textContent.split( " " )[ 0 ];
    beforeInr += +child.querySelector( "#tdTotalinr" ).textContent.split( " " )[ 0 ];
    percentage += +child.querySelector( "#tdPLPercentage" ).textContent.split( " " )[ 0 ];
    afterDollar += +child.querySelector( "#tdMarginDol" ).textContent.split( " " )[ 0 ];
    afterInr += +child.querySelector( "#tdMarginINR" ).textContent.split( " " )[ 0 ];

    if ( child.querySelector( "#tdCurTotalinr" ) )
      portFolio += +child.querySelector( "#tdCurTotalinr" ).textContent.split( " " )[ 0 ];
  }

  footChild[ 0 ].textContent = "₿ Invested: " + beforeDollar.toFixed( 2 );
  footChild[ 1 ].textContent = "₹ Invested: " + beforeInr.toFixed( 2 );
  footChild[ 2 ].textContent = "Average Percentage: " + ( percentage / children.length ).toFixed( 2 );
  footChild[ 3 ].textContent = "₿ Gain: " + afterDollar.toFixed( 2 );
  footChild[ 4 ].textContent = "₹ Gain: " + afterInr.toFixed( 2 );

  if ( portFolio ) {
    const lastPrice = +footChild[ 5 ].getAttribute( "lastPrice" ) || 0;
    const currentPrice = portFolio.toFixed( 2 );
    const color = lastPrice.toFixed( 2 ) == currentPrice ? "" : ( lastPrice < currentPrice ? "green" : "red" );
    footChild[ 5 ].setAttribute( "lastPrice", currentPrice );
    footChild[ 5 ].textContent = "Portfolio: " + currentPrice;
    footChild[ 5 ].style.color = color;
  }
}

async function AddHodlingRows_FromJSON ( obj,
  isUpdate = false )
{
  await UpdateFearGreedIndex( usdtinr );
  for ( const key in obj ) {

    if ( obj.hasOwnProperty( key ) ) {
      const { coin, pair, qty, price, term } = obj[ key ];
      const lastPrice = arrTicker.filter( e => e.symbol == ( coin + pair ) )[ 0 ].lastPrice;

      const row = isUpdate ? document.querySelector( "#" + key ) :
        document.getElementById( "templatePLRow" ).content.cloneNode( true );

      const isINR = pair == "inr";
      if ( !isUpdate ) {
        const rowParent = row.getElementById( "tdPairName" ).parentElement;
        rowParent.id = key;
        rowParent.setAttribute( "pairName", coin + pair );
        if ( !arr.includes( coin + pair ) )
          arr.push( coin + pair );
      }

      const totalToDollar = isINR ? ( ( price / usdtinr ) * qty ) : ( price * qty );
      const totalToInr = totalToDollar * usdtinr;

      const currentTotalToDollar = isINR ? ( ( lastPrice / usdtinr ) * qty ) : ( lastPrice * qty );
      const currentTotalToInr = currentTotalToDollar * usdtinr;
      const percentage = ( ( currentTotalToInr * 100 ) / totalToInr ) - 100;

      const marginDollar = currentTotalToDollar - totalToDollar;
      const marginINR = currentTotalToInr - totalToInr;

      row.querySelector( "#tdPairName" ).textContent = coin + pair;
      row.querySelector( "#tdBuyPrice" ).textContent = price;
      row.querySelector( "#tdQty" ).textContent = qty;
      row.querySelector( "#tdTerm" ).textContent = term;
      row.querySelector( "#tdTotalDollar" ).textContent = totalToDollar.toFixed( 2 ) + " ₿";
      row.querySelector( "#tdTotalinr" ).textContent = totalToInr.toFixed( 2 ) + " ₹";

      row.querySelector( "#tdCurrentPrice" ).textContent = lastPrice + ( isINR ? " ₹" : " ₿" );
      row.querySelector( "#tdCurTotalDollar" ).textContent = currentTotalToDollar.toFixed( 2 ) + " ₿";
      row.querySelector( "#tdCurTotalinr" ).textContent = currentTotalToInr.toFixed( 2 ) + " ₹";
      row.querySelector( "#tdPLPercentage" ).textContent = percentage.toFixed( 2 ) + " %";
      row.querySelector( "#tdMarginDol" ).textContent = marginDollar.toFixed( 2 ) + " ₿";
      row.querySelector( "#tdMarginINR" ).textContent = marginINR.toFixed( 2 ) + " ₹";

      if ( percentage > 0 ) {
        row.querySelector( "#tdMarginINR" ).parentNode.classList = "Profit";
      }

      if ( !isUpdate ) {
        if ( percentage > 0 )
          hodlingBody[ 0 ].prepend( row );
        else
          hodlingBody[ 0 ].appendChild( row );
      }
    }
  }
}

async function AddPLRows_FromJSON ( obj,
  isUpdate = false )
{
  for ( const key in obj ) {

    if ( obj.hasOwnProperty( key ) ) {
      const { coin, pair, qty, buyPrice, soldPrice, term } = obj[ key ];
      const row = isUpdate ? document.querySelector( "#" + key ) :
        document.getElementById( "templatePL1Row" ).content.cloneNode( true );

      const isINR = pair == "inr";
      if ( !isUpdate )
        row.getElementById( "tdPairName" ).parentElement.id = key;

      const totalToDollar = isINR ? ( ( buyPrice / usdtinr ) * qty ) : ( buyPrice * qty );
      const totalToInr = totalToDollar * usdtinr;

      const currentTotalToDollar = isINR ? ( ( soldPrice / usdtinr ) * qty ) : ( soldPrice * qty );
      const currentTotalToInr = currentTotalToDollar * usdtinr;
      const percentage = ( ( currentTotalToInr * 100 ) / totalToInr ) - 100;

      const marginDollar = currentTotalToDollar - totalToDollar;
      const marginINR = currentTotalToInr - totalToInr;

      row.querySelector( "#tdPairName" ).textContent = coin + pair;
      row.querySelector( "#tdBuyPrice" ).textContent = buyPrice;
      row.querySelector( "#tdSoldPrice" ).textContent = soldPrice;
      row.querySelector( "#tdQty" ).textContent = qty;
      row.querySelector( "#tdTerm" ).textContent = term;
      row.querySelector( "#tdTotalDollar" ).textContent = totalToDollar.toFixed( 2 ) + " ₿";
      row.querySelector( "#tdTotalinr" ).textContent = totalToInr.toFixed( 2 ) + " ₹";

      row.querySelector( "#tdPLPercentage" ).textContent = percentage.toFixed( 2 ) + " %";
      row.querySelector( "#tdMarginDol" ).textContent = marginDollar.toFixed( 2 ) + " ₿";
      row.querySelector( "#tdMarginINR" ).textContent = marginINR.toFixed( 2 ) + " ₹";

      if ( percentage < 0 ) {
        const parentRow = row.querySelector( "#tdMarginINR" ).parentNode.style;
        parentRow.background = "#c77777";
        parentRow.color = "#fff";
      }

      if ( !isUpdate )
        plBody[ 0 ].appendChild( row );
    }
  }
}

async function LiveUpdateHodlingTable ( event )
{
  try {
    if ( event.event && ( event.event == "subscribed" || event.event == "unsubscribed" ) )
      return;

    const array = event.data.filter( e => arr.includes( e.s ) );
    const usdtINRArray = array.filter( e => e.s == "usdtinr" );

    if ( usdtINRArray.length ) {
      usdtinr = usdtINRArray[ 0 ].c;
      await UpdateFearGreedIndex( usdtinr );
    }
    for ( let arrs of array ) {
      for ( let child of hodlingBody[ 0 ].querySelectorAll( "tr[pairName=" + arrs.s + "]" ) ) {
        const lastPrice = +child.querySelector( "#tdCurrentPrice" ).textContent.split( " " )[ 0 ];
        const qty = +child.querySelector( "#tdQty" ).textContent;
        const currentPrice = +arrs.c;
        const color = lastPrice == currentPrice ? "" : lastPrice < currentPrice ? "green" : "red";
        const prevPercentage = +child.querySelector( "#tdPLPercentage" ).textContent.split( " " )[ 0 ];

        const isINR = arrs.U == "inr";

        const totalToDollar = +child.querySelector( "#tdTotalDollar" ).textContent.split( " " )[ 0 ];
        const totalToInr = +child.querySelector( "#tdTotalinr" ).textContent.split( " " )[ 0 ];

        const currentTotalToDollar = isINR ? ( ( currentPrice / usdtinr ) * qty ) : ( currentPrice * qty );
        const currentTotalToInr = currentTotalToDollar * usdtinr;
        const percentage = ( ( currentTotalToInr * 100 ) / totalToInr ) - 100;

        const marginDollar = currentTotalToDollar - totalToDollar;
        const marginINR = currentTotalToInr - totalToInr;

        child.querySelector( "#tdCurrentPrice" ).textContent = currentPrice + ( isINR ? " ₹" : " ₿" );
        child.querySelector( "#tdCurTotalDollar" ).textContent = currentTotalToDollar.toFixed( 2 ) + " ₿";
        child.querySelector( "#tdCurTotalinr" ).textContent = currentTotalToInr.toFixed( 2 ) + " ₹";
        child.querySelector( "#tdPLPercentage" ).textContent = percentage.toFixed( 2 ) + " %";
        child.querySelector( "#tdMarginDol" ).textContent = marginDollar.toFixed( 2 ) + " ₿";
        child.querySelector( "#tdMarginINR" ).textContent = marginINR.toFixed( 2 ) + " ₹";

        child.querySelector( "#tdCurrentPrice" ).style.color = color;
        child.querySelector( "#tdCurTotalDollar" ).style.color = color;
        child.querySelector( "#tdCurTotalinr" ).style.color = color;
        child.querySelector( "#tdPLPercentage" ).style.color = color;
        child.querySelector( "#tdMarginDol" ).style.color = color;
        child.querySelector( "#tdMarginINR" ).style.color = color;

        if ( prevPercentage < 0 && percentage.toFixed( 2 ) > 0 ) {
          // move row to top
          const parent = child.parentNode;
          parent.insertBefore( child, child.parentNode.querySelector( ".Profit" ) );
          child.classList = "Profit";
        }
        else if ( prevPercentage > 0 && percentage.toFixed( 2 ) < 0 ) {
          const parent = child.parentNode;
          parent.insertBefore( child, [ ...child.parentNode.querySelectorAll( ".Profit" ) ].pop().nextElementSibling );
          child.classList = "";
          // move row to below top rows
        }
      }
    }
    SummationPLTable( hodlingBody );
  } catch ( error ) {
    console.log( error );
  }
}

async function UpdateFearGreedIndex ( usdtinr, isUpdate = false )
{
  const divFearGreedContainer = document.getElementsByClassName( "divFearGreedIndex" );
  divFearGreedContainer[ 0 ].querySelector( "#spanDollarPrice" ).textContent = usdtinr;

  if ( !isUpdate ) {
    const fearGreed = await Const.fearGreed();
    divFearGreedContainer[ 0 ].querySelector( "#spanValue" ).textContent = fearGreed.data[ 0 ].value + " %";
    divFearGreedContainer[ 0 ].querySelector( "#spanClassification" ).textContent = fearGreed.data[ 0 ].value_classification;
  }
}
