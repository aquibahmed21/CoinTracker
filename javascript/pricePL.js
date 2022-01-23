"use strict";

import * as Const from "./constants.js";
import * as webSocket from "./websocket.js";

const hodlingTable = document.getElementById( "table" );
const hodlingBody = hodlingTable.getElementsByTagName( "tbody" );

const plTable = hodlingTable.nextElementSibling;
const plBody = plTable.getElementsByTagName( "tbody" );


const arrTicker = await Const.getTicker();
let usdtinr = arrTicker.filter( e => e.symbol == ( "usdtinr" ) )[ 0 ].lastPrice;

const arr = [];

await AddHodlingRows_FromJSON( Const.JSONDATA );
await AddPLRows_FromJSON( Const.SoldJSon );
SummationPLTable(hodlingBody);
SummationPLTable(plBody);
webSocket.wsSubscribe( LiveUpdateHodlingTable );

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
      if ( !isUpdate )
      {
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

      if ( percentage > 0 )
      {
        row.querySelector( "#tdMarginINR" ).parentNode.classList = "Profit";
      }

      if ( !isUpdate )
      {
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
  for ( const key in obj )
  {

    if ( obj.hasOwnProperty( key ) )
    {
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

      if ( percentage < 0 )
      {
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
  try
  {

    if ( event.event && (event.event == "subscribed" || event.event == "unsubscribed") )
      return;

    const array = event.data.filter( e => arr.includes( e.s ) );
    const usdtINRArray = array.filter( e => e.s == "usdtinr" );

    if ( usdtINRArray.length )
    {
      usdtinr = usdtINRArray[ 0 ].c;
      await UpdateFearGreedIndex( usdtinr );
    }
    for ( let arrs of array )
    {
      for ( let child of hodlingBody[ 0 ].querySelectorAll( "tr[pairName=" + arrs.s + "]" ) )
      {
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

        // ! ------------------------- TBT
        if ( prevPercentage < 0 && percentage.toFixed(2) > 0 )
        {
          // move row to top
          const parent = child.parentNode;
          parent.insertBefore(child, child.parentNode.querySelector(".Profit"))
          child.classList = "Profit";
        }
        else if ( prevPercentage > 0 && percentage.toFixed(2) < 0 )
        {
          const parent = child.parentNode;
          parent.insertBefore( child, [ ...child.parentNode.querySelectorAll( ".Profit" ) ].pop().nextElementSibling );
          child.classList = "";
          // move row to below top rows
        }
        // ! ----------------------
      }
    }
    SummationPLTable( hodlingBody );
  } catch ( error ) {
    console.log( error );
  }
}

function SummationPLTable (body)
{
  const children = body[ 0 ].children;
  const footChild = body[ 0 ].nextElementSibling.children[ 0 ].children;

  let beforeDollar = 0, beforeInr = 0, percentage = 0, afterDollar = 0, afterInr = 0, portFolio = 0;

  for ( let child of children )
  {
    beforeDollar += +child.querySelector( "#tdTotalDollar" ).textContent.split( " " )[ 0 ];
    beforeInr += +child.querySelector( "#tdTotalinr" ).textContent.split( " " )[ 0 ];
    percentage += +child.querySelector( "#tdPLPercentage" ).textContent.split( " " )[ 0 ];
    afterDollar += +child.querySelector( "#tdMarginDol" ).textContent.split( " " )[ 0 ];
    afterInr += +child.querySelector( "#tdMarginINR" ).textContent.split( " " )[ 0 ];

    if (child.querySelector( "#tdCurTotalinr" ))
      portFolio += +child.querySelector( "#tdCurTotalinr" ).textContent.split( " " )[ 0 ];
  }

  footChild[ 0 ].textContent = "₿ Invested: " + beforeDollar.toFixed( 2 );
  footChild[ 1 ].textContent = "₹ Invested: " + beforeInr.toFixed( 2 );
  footChild[ 2 ].textContent = "Average Percentage: " + ( percentage / children.length ).toFixed( 2 );
  footChild[ 3 ].textContent = "₿ Gain: " + afterDollar.toFixed( 2 );
  footChild[ 4 ].textContent = "₹ Gain: " + afterInr.toFixed( 2 );

  if ( portFolio )
  {
    const lastPrice = +footChild[ 5 ].getAttribute( "lastPrice") || 0;
    const currentPrice = portFolio.toFixed( 2 );
    const color = lastPrice.toFixed( 2 ) == currentPrice ? "" : ( lastPrice < currentPrice ? "green" : "red" );
    footChild[ 5 ].setAttribute( "lastPrice", currentPrice );
    footChild[ 5 ].textContent = "Portfolio: " + currentPrice;
    footChild[ 5 ].style.color = color;
  }
}

async function UpdateFearGreedIndex ( usdtinr, isUpdate = false )
{
  const divFearGreedContainer = document.getElementsByClassName( "divFearGreedIndex" );
  divFearGreedContainer[ 0 ].querySelector( "#spanDollarPrice" ).textContent = usdtinr;

  if ( !isUpdate )
  {
    const fearGreed = await Const.fearGreed();
    divFearGreedContainer[ 0 ].querySelector( "#spanValue" ).textContent = fearGreed.data[ 0 ].value + " %";
    divFearGreedContainer[ 0 ].querySelector( "#spanClassification" ).textContent = fearGreed.data[ 0 ].value_classification;
  }
}
