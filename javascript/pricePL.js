import * as Const from "./constants.js";

const table = document.getElementById("table");
const tbody = table.getElementsByTagName( "tbody" );

const table1 = document.getElementById("table1");
const tbody1 = table1.getElementsByTagName("tbody");

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

  const arrTicker = await Const.getTicker();
  const usdtinr = arrTicker.filter( e => e.symbol == ( "usdtinr" ) )[ 0 ].lastPrice;
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
        row.getElementById( "tdPairName" ).parentElement.id = key;

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
        tbody[0].appendChild(row);
    }
  }
}

async function AddRows_FromJSON1 ( obj,
                                  isUpdate = false )
{

  const arrTicker = await Const.getTicker();
  const usdtinr = arrTicker.filter( e => e.symbol == ( "usdtinr" ) )[ 0 ].lastPrice;
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

      row.querySelector("#tdPLPercentage").textContent =      percentage.toFixed(2) + "%";
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



await AddRows_FromJSON(Const.JSONDATA);
await AddRows_FromJSON1(Const.SoldJSon)