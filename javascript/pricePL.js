import * as Const from "./constants.js";
import * as Test from "./test.js";

const table = document.getElementById("table");
const tbody = table.getElementsByTagName( "tbody" );

const table1 = document.getElementById("table1");
const tbody1 = table1.getElementsByTagName( "tbody" );

const arrTicker = await Const.getTicker();
const usdtinr = arrTicker.filter( e => e.symbol == ( "usdtinr" ) )[ 0 ].lastPrice;

const arr = [];

table.addEventListener( "click", OnClick_Row.bind( this, tbody ) );

async function UpdateFearGreedIndex (usdtinr)
{
  const fearGreed = await Const.fearGreed();
  const divFearGreedContainer = document.getElementsByClassName( "divFearGreedIndex" );
  divFearGreedContainer[ 0 ].querySelector( "#spanValue" ).textContent = fearGreed.data[ 0 ].value + " %";
  divFearGreedContainer[ 0 ].querySelector( "#spanClassification" ).textContent = fearGreed.data[ 0 ].value_classification;
  divFearGreedContainer[ 0 ].querySelector( "#spanDollarPrice" ).textContent = usdtinr;
}

async function AddRows_FromJSON ( obj,
                                  isUpdate = false )
{

  await UpdateFearGreedIndex( usdtinr );
  for ( const key in obj )
  {

    if ( obj.hasOwnProperty( key ) )
    {
      const { coin, pair, qty, price, term } = obj[key];
      const lastPrice = arrTicker.filter( e => e.symbol == ( coin + pair ) )[ 0 ].lastPrice;


      const row = isUpdate ? document.querySelector( "#" + key ):
                             document.getElementById( "templatePLRow" ).content.cloneNode( true );

      const isINR = pair == "inr";
      if ( !isUpdate )
      {
        const rowParent = row.getElementById( "tdPairName" ).parentElement;
        rowParent.id = key;
        rowParent.setAttribute( "pairName", coin + pair );
        if (!arr.includes( coin + pair ))
          arr.push( coin + pair );
      }

      const totalToDollar = isINR ? ( ( price / usdtinr ) * qty ) : ( price * qty );
      const totalToInr = totalToDollar * usdtinr;

      const currentTotalToDollar = isINR ? ( ( lastPrice / usdtinr ) * qty ) : ( lastPrice * qty );
      const currentTotalToInr = currentTotalToDollar * usdtinr;
      const percentage = ( ( currentTotalToInr * 100 ) / totalToInr ) - 100;

      const marginDollar = currentTotalToDollar - totalToDollar;
      const marginINR = currentTotalToInr - totalToInr;

      row.querySelector("#tdPairName").textContent =          coin + pair;
      row.querySelector("#tdBuyPrice").textContent =          price;
      row.querySelector("#tdQty").textContent =               qty;
      row.querySelector("#tdTerm").textContent =              term;
      row.querySelector("#tdTotalDollar").textContent =       totalToDollar.toFixed(2) + " ₿";
      row.querySelector("#tdTotalinr").textContent =          totalToInr.toFixed(2) + " ₹";

      row.querySelector("#tdCurrentPrice").textContent =      lastPrice + (isINR ? " ₹" :" ₿");
      row.querySelector("#tdCurTotalDollar").textContent =    currentTotalToDollar.toFixed(2) + " ₿";
      row.querySelector("#tdCurTotalinr").textContent =       currentTotalToInr.toFixed(2) + " ₹";
      row.querySelector("#tdPLPercentage").textContent =      percentage.toFixed(2) + "%";
      row.querySelector("#tdMarginDol").textContent =         marginDollar.toFixed(2) + " ₿";
      row.querySelector("#tdMarginINR").textContent =         marginINR.toFixed(2) + " ₹";

      if ( percentage > 0 )
      {
        const parentRow = row.querySelector( "#tdMarginINR" ).parentNode.style;
        parentRow.background = "#679f67";
        parentRow.color = "#fff";
      }

      if (!isUpdate)
      {
        if ( percentage > 0 )
          tbody[ 0 ].prepend( row );
        else
          tbody[0].appendChild(row);
      }
    }
  }
}

async function AddRows_FromJSON1 ( obj,
                                  isUpdate = false )
{
  for ( const key in obj )
  {

    if ( obj.hasOwnProperty( key ) )
    {
      const { coin, pair, qty, buyPrice, soldPrice, term } = obj[key];
      // const lastPrice = arrTicker.filter( e => e.symbol == ( coin + pair ) )[ 0 ].lastPrice;


      const row = isUpdate ? document.querySelector( "#" + key ):
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

      row.querySelector("#tdPairName").textContent =          coin + pair;
      row.querySelector("#tdBuyPrice").textContent =          buyPrice;
      row.querySelector("#tdSoldPrice").textContent =         soldPrice;
      row.querySelector("#tdQty").textContent =               qty;
      row.querySelector("#tdTerm").textContent =              term;
      row.querySelector("#tdTotalDollar").textContent =       totalToDollar.toFixed(2) + " ₿";
      row.querySelector("#tdTotalinr").textContent =          totalToInr.toFixed(2) + " ₹";

      row.querySelector("#tdPLPercentage").textContent =      percentage.toFixed(2) + " %";
      row.querySelector("#tdMarginDol").textContent =         marginDollar.toFixed(2) + " ₿";
      row.querySelector("#tdMarginINR").textContent =         marginINR.toFixed(2) + " ₹";

      if ( percentage < 0 )
      {
        const parentRow = row.querySelector( "#tdMarginINR" ).parentNode.style;
        parentRow.background = "#c77777";
        parentRow.color = "#fff";
      }

      if (!isUpdate)
        tbody1[0].appendChild(row);
    }
  }
}

async function OnClick_Row(tbody, event = window.event) {
  const targetID = event.target.id;
  switch (targetID) {
    // case "tdRefresh":
    //   {
    //     const parent = event.target.parentElement;
    //     UpdateRowsValue(parent);
    //   }
    //   break;
    case "thRefresh":
      await AddRows_FromJSON( Const.JSONDATA, true);
      break;

    default:
      break;
  }
}

await AddRows_FromJSON( Const.JSONDATA );
await AddRows_FromJSON1( Const.SoldJSon );
Test.wsSubscribe( arr.map( e => e + "@trades" ), tesst );

function tesst (event)
{
try {
  const array = event.data.filter( e => arr.includes( e.s ) );
  for ( let arrs of array )
  {
    for ( let child of tbody[ 0 ].querySelectorAll( "tr[pairName=" + arrs.s + "]" ) )
    {
      const tds = child.querySelectorAll( "td" );
      const lastPrice = +child.querySelector("#tdCurrentPrice").textContent.split( " " )[ 0 ];
      const qty = +child.querySelector( "#tdQty" ).textContent;
      const currentPrice = +arrs.c;
      const color = lastPrice == currentPrice ? "" : lastPrice < currentPrice ? "green" : "red";

      const isINR = arrs.U == "inr";

      const totalToDollar = +child.querySelector("#tdTotalDollar").textContent.split(" ")[0];
      const totalToInr = +child.querySelector("#tdTotalinr").textContent.split(" ")[0];

      const currentTotalToDollar = isINR ? ( ( lastPrice / usdtinr ) * qty ) : ( lastPrice * qty );
      const currentTotalToInr = currentTotalToDollar * usdtinr;
      const percentage = ( ( currentTotalToInr * 100 ) / totalToInr ) - 100;

      const marginDollar = currentTotalToDollar - totalToDollar;
      const marginINR = currentTotalToInr - totalToInr;

      child.querySelector("#tdCurrentPrice").textContent =      lastPrice + (isINR ? " ₹" :" ₿");
      child.querySelector("#tdCurTotalDollar").textContent =    currentTotalToDollar.toFixed(2) + " ₿";
      child.querySelector("#tdCurTotalinr").textContent =       currentTotalToInr.toFixed(2) + " ₹";
      child.querySelector("#tdPLPercentage").textContent =      percentage.toFixed(2) + "%";
      child.querySelector("#tdMarginDol").textContent =         marginDollar.toFixed(2) + " ₿";
      child.querySelector("#tdMarginINR").textContent =         marginINR.toFixed(2) + " ₹";

      child.querySelector("#tdCurrentPrice").style.color = color;
      child.querySelector("#tdCurTotalDollar").style.color = color;
      child.querySelector("#tdCurTotalinr").style.color = color;
      child.querySelector("#tdPLPercentage").style.color = color;
      child.querySelector("#tdMarginDol").style.color = color;
      child.querySelector("#tdMarginINR").style.color = color;
    }
  }
} catch (error) {
  console.log( error );
}
}

function test ()
{
  const children = tbody1[ 0 ].children;
  const footChild = tbody1[ 0 ].nextElementSibling.children[0].children;
  let beforeDollar = 0, beforeInr = 0, percentage = 0, afterDollar = 0, afterInr = 0;
  let text1 = "", text2 = "";
  for ( let child of children )
  {
    beforeDollar += +child.querySelector( "#tdTotalDollar" ).textContent.split( " " )[ 0 ];
    beforeInr += +child.querySelector( "#tdTotalinr" ).textContent.split( " " )[ 0 ];
    percentage += +child.querySelector( "#tdPLPercentage" ).textContent.split( " " )[ 0 ];
    afterDollar += +child.querySelector( "#tdMarginDol" ).textContent.split( " " )[ 0 ];
    afterInr += +child.querySelector( "#tdMarginINR" ).textContent.split( " " )[ 0 ];
  }
  footChild[ 0 ].textContent = "₿ Invested: " + beforeDollar.toFixed(2);
  footChild[ 1 ].textContent = "₹ Invested: " + beforeInr.toFixed(2);
  footChild[ 2 ].textContent = "Average Percentage: " + (percentage/children.length).toFixed(2);
  footChild[ 3 ].textContent = "₿ Gain: " + afterDollar.toFixed(2);
  footChild[ 4 ].textContent = "₹ Gain : " + afterInr.toFixed(2);
}

test();