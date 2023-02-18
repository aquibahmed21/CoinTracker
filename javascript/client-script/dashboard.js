"use strict";

import * as Const from "./constants.js";
import * as webSocket from "./websocket.js";

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
  KEYS_GET: "/api/keys",
  DELETE_HODL_COIN_POST: "/api/hodling/delete",
  DELETE_PL_COIN_POST: "/api/pllist/delete",
  HODLING_UPDATE_POST: "/api/hodling/update",
  PL_UPDATE_POST: "/api/pllist/update",
  OPEN_ORDERS_GET: "openOrder"
};

let PL_LIST = Const.SoldJSon;
let HODLING = Const.JSONDATA;

let email = "";

const coinPairArr = [];
let missMatchAssets = [];

const hodlingTable = document.getElementById( "table" );
for ( const item of hodlingTable.getElementsByTagName( "thead" )[ 0 ].children[ 0 ].children )
  item.addEventListener( "click", () => sortTable( item.cellIndex, hodlingTable ) );
const hodlingBody = hodlingTable.getElementsByTagName( "tbody" );

const plTable = hodlingTable.parentElement.nextElementSibling;
for ( const item of plTable.getElementsByTagName( "thead" )[ 0 ].children[ 0 ].children )
  item.addEventListener( "click", () => sortTable( item.cellIndex, plTable.children[ 0 ] ) );
const plBody = plTable.getElementsByTagName( "tbody" );

const notificationBTN = document.getElementById( "notif" );
const hodlingCaption = hodlingTable.getElementsByTagName( "caption" )[ 0 ];
const plCaption = plTable.getElementsByTagName( "caption" )[ 0 ];
const coinDetailsPopup = document.getElementsByClassName( "signup-container" )[ 0 ];
const LongPressPopup = document.getElementsByClassName( "divLongPressPopUp" )[ 0 ];
const sideNav = document.getElementsByClassName( "divSideNav" )[ 0 ];

const getStopLossValue = ( price, percentage, decimal = 1 ) => ( price - ( ( price * percentage ) / 100 ) ).toFixed( decimal );

window.addEventListener( "DOMContentLoaded", async () => {
  const token = localStorage.getItem( "token" );
  let userID = "";
  if ( token ) {
    const resData = await Const.fetchUtils( Routes.AUTH_GET, Method.GET );
    if ( resData && resData.status === "success" && resData.user ) {
      userID = resData.user._id;
      email = resData.user.email;
      localStorage.setItem( "uid", userID );
    } else
    {
      window.location.href = "/";
      return;
    }

    const credentials = await ( await fetch( Routes.KEYS_GET, {
      method: Method.GET,
      headers: {
        "Content-Type": "application/json",
        uid: userID
      }
    } ) ).json();

    if ( credentials.status !== "success" ) {
      // prompt for keys
      const api = prompt( "Enter your API_KEY" );
      const sec = prompt( "Enter your SECRET_KEY" );
      const uid = userID;
      if ( !api || !sec || !uid )
        return ShowNotification( "Please enter all fields after refresh" );

      const { message } = await ( await fetch( Routes.KEYS_GET, {
        method: Method.POST,
        headers: {
          "Content-Type": "application/json",
          uid: userID
        },
        body: JSON.stringify( { api, sec, uid } )
      } ) ).json();
      ShowNotification( message );
    }

    PL_LIST = await fetch( Routes.PL_LIST_POST,
      {
        method: Method.GET,
        headers: {
          "Content-Type": "application/json",
          uid: userID
        }
      } ).then( res => res.json() );
    PL_LIST = PL_LIST.message;
    HODLING = await fetch( Routes.HODLING_POST,
      {
        method: Method.GET,
        headers: {
          "Content-Type": "application/json",
          uid: userID
        }
      } ).then( res => res.json() );
    HODLING = HODLING.message;
  } else {
    window.location.href = "/";
    return;
  }

  // ! Edit profile
  document.getElementById( "imgeditprofile" ).addEventListener( "click", () => {
    ShowNotification( " Edit profile not implemented yet" );
    // return;
    // document.getElementById( "ProfileContainer" ).children[ 0 ].classList.add( "Util_hide" );
    // document.getElementById( "ProfileContainer" ).children[ 1 ].classList.remove( "Util_hide" );
  } );

  // ! Sign-out
  document.getElementById( "spanSignOut" ).addEventListener( "click", () => {
    localStorage.removeItem( "token" );
    localStorage.removeItem( "uid" );
    window.location.href = "/";
  } );

  document.getElementById( "cancelOpenOrders" ).addEventListener( "click", async ( event ) => {
    ShowNotification( "Cancel orders not happening yet..." );

    // !
    // if ( confirm( "Are you sure you want to cancel all open orders?" ) ) {

    //   const res_data = await ( await fetch( "cancelAllOrders", {
    //     method: Method.GET,
    //     headers: {
    //       "Content-Type": "application/json",
    //       "uid": userID
    //     }
    //   } ) ).json();

    //   // const res_data = await Const.fetchUtils( "cancelAllOrders", Method.GET );

    //   console.log( res_data.message );

    //   event.target.parentElement.nextElementSibling.replaceChildren();
    // }
  } );

  sideNav.addEventListener( "click", async ( event ) => {
    const targetID = event.target.id;
    const allContainers = document.querySelectorAll( ".RootContainer" );
    switch ( targetID ) {
      case "spanDashboard":
        allContainers.forEach( ( container ) => container.classList.add( "Util_hide" ) );
        document.getElementById( "IndexContainer" ).classList.remove( "Util_hide" );
        sideNav.classList.toggle( "active" );
        break;
      case "spanAbout":
        ShowNotification( "Not yet implemented" );
        break;
      case "spanProfile":
        allContainers.forEach( ( container ) => container.classList.add( "Util_hide" ) );
        document.getElementById( "ProfileContainer" ).classList.remove( "Util_hide" );
        sideNav.classList.toggle( "active" );
        break;
      case "spanCharts":
        // return ShowNotification( "Implementation Disabled" );
        if ( !document.getElementsByTagName( "iframe" )[ 0 ] )
          TradingViewPreview();
        else {
          allContainers.forEach( ( container ) => container.classList.add( "Util_hide" ) );
          document.getElementById( "TradingView" ).classList.remove( "Util_hide" );
          sideNav.classList.toggle( "active" );
        }
        break;
      case "spanOrders":
        {
          const orderContainer = document.getElementById( "OrdersContainer" );
          allContainers.forEach( ( container ) => container.classList.add( "Util_hide" ) );
          orderContainer.classList.remove( "Util_hide" );

          const funds = await ( await fetch( Routes.FUNDS_GET, {
            method: Method.GET,
            headers: {
              "Content-Type": "application/json",
              uid: userID
            }
          } ) ).json();

          const divFundsHolder = orderContainer.querySelector( "#divFundsHolder" );
          divFundsHolder.innerHTML = "";

          funds.forEach( e => {
            const div = document.createElement( "div" );
            div.classList.add( "flex-item" );
            let span = document.createElement( "span" );
            span.innerHTML = e.asset;
            div.append( span );
            span = document.createElement( "span" );
            span.innerHTML = e.free;
            div.append( span );
            if ( +e.locked !== 0 ) {
              span = document.createElement( "span" );
              span.innerHTML = e.locked;
              div.append( span );
            }
            divFundsHolder.append( div );
          } );

          // --- Get open orders --- //

          const openOrders = await ( await fetch( Routes.OPEN_ORDERS_GET, {
            method: Method.GET,
            headers: {
              "Content-Type": "application/json",
              uid: userID
            }
          } ) ).json();

          const divOpenOrdersHolder = orderContainer.querySelector( "#divOpenOrdersHolder" );
          divOpenOrdersHolder.innerHTML = "";

          openOrders.forEach( e => {
            const div = document.createElement( "div" );
            div.classList.add( "flex-item1" );

            if ( e.side === "buy" )
              div.style.background = "#679f67";

            let span = document.createElement( "span" );
            span.innerHTML = "coin: " + e.symbol;
            div.append( span );
            span = document.createElement( "span" );
            span.innerHTML = "qty: " + e.origQty;
            div.append( span );
            span = document.createElement( "span" );
            span.innerHTML = "price: " + e.price;
            div.append( span );
            span = document.createElement( "span" );
            span.innerHTML = "exec qty: " + e.executedQty;
            div.append( span );
            span = document.createElement( "span" );
            span.innerHTML = "time: " + Const.GetDisplayTime( e.createdTime );
            div.append( span );
            span = document.createElement( "span" );
            span.innerHTML = "side: " + e.side;
            div.append( span );
            divOpenOrdersHolder.append( div );
          } );
        }
        break;
      default:
        if ( event.target.tagName === "SPAN" )
          return sideNav.classList.toggle( "active" );
        break;
    }
  } );

  LongPressPopup.addEventListener( "click", async ( event ) => {
    const { coin, pair, qty, buyPrice, soldPrice, targetID, comment } = JSON.parse( LongPressPopup.getAttribute( "data" ) );
    const uid = localStorage.getItem( "uid" );
    const target = event.target.id;
    const isHOLDLingTable = document.getElementById( targetID ).parentElement.parentElement.id === "table";
    switch ( target ) {
      case "btnEdit":
        // eslint-disable-next-line no-lone-blocks
        {
          coinDetailsPopup.classList.remove( "Util_hide" );
          coinDetailsPopup.querySelector( "#pets-name" ).focus();
          coinDetailsPopup.querySelector( "#divSoldPrice" ).classList.add( "Util_hide" );
          coinDetailsPopup.setAttribute( "isEdit", "true" );
          coinDetailsPopup.setAttribute( "targetID", targetID );

          CloseLongPressPopup();

          coinDetailsPopup.querySelector( "#pets-name" ).value = coin;
          coinDetailsPopup.querySelector( "input[value=" + pair + "]" ).checked = true;
          coinDetailsPopup.querySelector( "#pets-breed" ).value = qty;
          coinDetailsPopup.querySelector( "#pets-birthday" ).value = buyPrice;
          coinDetailsPopup.querySelector( "#divCommentTerm" ).textContent = comment;
          if ( !isHOLDLingTable ) {
            coinDetailsPopup.querySelector( "#pets-birthday2" ).value = soldPrice;
            coinDetailsPopup.querySelector( "#pets-birthday2" ).parentElement.classList.remove( "Util_hide" );
          } else {
            coinDetailsPopup.querySelector( "#pets-birthday2" ).value = 0;
            coinDetailsPopup.querySelector( "#pets-birthday2" ).parentElement.classList.add( "Util_hide" );
          }
        }
        break;
      case "btnSell":
      {
        //! remove row from hodling table
        table.querySelectorAll( "tbody" )[ 0 ].children[ targetID ].remove();

        //! close popup
        CloseLongPressPopup();

        // TODO: Update USDT/INR balance
        // get usdt/inr current balance
        // update usdt/inr balance

        // TODO: Calculate 0.4% commission
        // check if user eligible for commission
        // if yes, and opted for reduction of commission
        // if yes, has wrxusdt coin
        // if yes, calculate commission
        // get current balance
        // update balance

        //! put sell order
        const side = Side.SELL; // Enum
        const type = Type.LIMIT; // Enum
        const coinpair = coin + pair;
        // // const body = { coinpair, qty, currentPrice: soldPrice, type, side };
        // // const response = await Const.fetchUtils( Routes.ORDER_POST, Method.POST, body );
        await ( await fetch( Routes.ORDER_POST, {
          method: Method.POST,
          headers: {
            "Content-Type": "application/json",
            uid
          },
          body: JSON.stringify( { coinpair, qty, currentPrice: soldPrice, type, side, uid } )
        } ) ).json().catch( err => console.log( err ) );

        //! remove coin from hodling db
        const id = targetID;
        await ( await fetch( Routes.DELETE_HODL_COIN_POST, {
          method: Method.POST,
          headers: {
            "Content-Type": "application/json",
            uid
          },
          body: JSON.stringify( { id } )
        } ) ).json().catch( err => console.log( err ) );

        //! add coin to pl db
        const res = await ( await fetch( Routes.PL_LIST_POST, {
          method: Method.POST,
          headers: {
            "Content-Type": "application/json",
            uid
          },
          body: JSON.stringify( { coin, pair, qty, buyPrice, soldPrice, term: comment, uid } )
        } ) ).json().catch( err => console.log( err ) );

        //! add row to pllist table
        await AddPLRowsFromJSON( [ { coin, pair, qty, buyPrice, soldPrice, term: comment, id: res.id } ] );

        return; // !return to avoid the below code
        // if pair usdt
        // calculate usdt/inr add or subtract from purchased coin (qty * coinPrice)
        // get usdt/inr current balance from db
        // get filtered usdt/inr from db
        // get { coin, pair, qty, price, term, uid, _id } from from filtered usdt/inr
        // add/sub usdt
        // prepare body { coin, pair:Pair, qty: totalusdthodling, price: usdtPrice, term, id: _id };
        // update usdt/inr balance db
        // update usdt/inr balance hodling table

        // if ( pair === "usdt" ) {
        //   const deductUSDT = +qty * +price;
        //   let HODLING = await fetch( Routes.HODLING_POST,
        //     {
        //       method: Method.GET,
        //       headers: {
        //         "Content-Type": "application/json",
        //         uid: userID
        //       }
        //     } ).then( res => res.json() );
        //   HODLING = HODLING.message;
        //   const usdtobj = HODLING.filter( e => ( e.coin + e.pair ) === PAIR.USDT )[ 0 ];
        //   const { coin, pair: Pair, qty: usdtqty, price: usdtPrice, term, uid, soldPrice, buyPrice, _id } = usdtobj;
        //   const totalusdthodling = isPLList ? usdtqty + deductUSDT : usdtqty - deductUSDT;
        //   const body = { coin, pair: Pair, qty: totalusdthodling, price: usdtPrice, term, id: _id };
        //   const response = await Const.fetchUtils( Routes.HODLING_UPDATE_POST, Method.POST, body );
        //   await AddHodlingRowsFromJSON( [ body ], true );
        // }
      }
      // break;
      case "btnSL":
      {
        //! remove row from hodling table
        // table.querySelectorAll( "tbody" )[ 0 ].children[ targetID ].remove();

        //! add row to pllist table
        // await AddPLRows_FromJSON( [ { coin, pair, qty, buyPrice, soldPrice, term: comment } ] );

        //! close popup
        CloseLongPressPopup();

        // TODO: Update USDT/INR balance
        // get usdt/inr current balance
        // update usdt/inr balance

        // TODO: Calculate 0.4% commission
        // check if user eligible for commission
        // if yes, and opted for reduction of commission
        // if yes, has wrxusdt coin
        // if yes, calculate commission
        // get current balance
        // update balance

        //! put sell order
        const side = Side.SELL; // Enum
        const type = Type.STOP_LIMIT; // Enum
        const coinpair = coin + pair;
        const price = getStopLossValue( soldPrice, 2, 4 );
        const stopPrice = getStopLossValue( soldPrice, 4, 4 );
        const body = { coinpair, qty, currentPrice: price, type, side, stopPrice, uid };

        await ( await fetch( Routes.ORDER_POST, {
          method: Method.POST,
          headers: {
            "Content-Type": "application/json",
            uid
          },
          body: JSON.stringify( body )
        } ) ).json().catch( err => console.log( err ) );
        return;
      }
      case "btnSLValue":
        CloseLongPressPopup();
        ShowSLFunction( document.getElementById( targetID ), ShowNotification );
        break;
      case "btnBaseCoin":
        // eslint-disable-next-line no-lone-blocks
        {
          if ( isHOLDLingTable ) {
            let sellValue = soldPrice;
            if ( !confirm( "Are you sure you want to move with current sell price?" ) )
              sellValue = +prompt( "Enter your sell price" );

            const body = { coin, pair, qty, buyPrice, soldPrice: sellValue, term: comment, uid };
            await Const.fetchUtils( Routes.DELETE_HODL_COIN_POST, Method.POST, { id: targetID } );
            const res = await Const.fetchUtils( Routes.PL_LIST_POST, Method.POST, body );
            body.id = res.id;
            hodlingBody[ 0 ].children[ targetID ].remove();
            await AddPLRowsFromJSON( [ body ] );
          } else {
            const body = { coin, pair, qty, price: buyPrice, term: comment, uid };
            await Const.fetchUtils( Routes.DELETE_PL_COIN_POST, Method.POST, { id: targetID } );
            const response = await Const.fetchUtils( Routes.HODLING_POST, Method.POST, body );
            body.id = response.id;
            plBody[ 0 ].children[ targetID ].remove();
            await AddHodlingRowsFromJSON( [ body ] );
          }

          CloseLongPressPopup();
        }
        break;
      case "btnDelete":
        {
          let fetchRoute = "";
          if ( isHOLDLingTable ) {
            table.querySelectorAll( "tbody" )[ 0 ].children[ targetID ].remove();
            fetchRoute = Routes.DELETE_HODL_COIN_POST;
          } else {
            plTable.querySelectorAll( "tbody" )[ 0 ].children[ targetID ].remove();
            fetchRoute = Routes.DELETE_PL_COIN_POST;
          }
          //! remove coin from hodling db

          const id = targetID;
          await ( await fetch( fetchRoute, {
            method: Method.POST,
            headers: {
              "Content-Type": "application/json",
              uid
            },
            body: JSON.stringify( { id } )
          } ) ).json().catch( err => console.log( err ) );

          CloseLongPressPopup();
        }
        break;
      case "btnCls":
        CloseLongPressPopup();
        break;

      default: break;
    }
  } );

  const arrTicker = await Const.getTicker() || await Const.getTicker();

  function ShowNotification ( content, isError = false ) {
    notificationBTN.style.backgroundColor = isError ? "#ff1515c7" : "";
    notificationBTN.style.animation = isError ? "movein .5s ease forwards, moveout .5s 3s ease forwards" : "";
    notificationBTN.style.fontWeight = isError ? "600" : "";
    notificationBTN.style.height = isError ? "auto" : "";
    notificationBTN.innerHTML = content;
    notificationBTN.classList.add( "visible" );
  }

  if ( !arrTicker ) {
    window.alert( "Error: No ticker found, Please refresh.." );
    return window.location.refresh();
  }

  const PAIR = {
    BTC: "btcinr",
    WRX: "wrxinr",
    USDT: "usdtinr"
  };

  let usdtinr = arrTicker.filter( e => e.symbol === ( PAIR.USDT ) )[ 0 ].lastPrice;
  let btcinr = arrTicker.filter( e => e.symbol === ( PAIR.BTC ) )[ 0 ]?.lastPrice || 0;
  let wrxinr = arrTicker.filter( e => e.symbol === ( PAIR.WRX ) )[ 0 ]?.lastPrice || 0;

  // const funds = await ( await fetch( Routes.FUNDS_GET, {
  //   method: Method.GET,
  //   headers: {
  //     "Content-Type": "application/json",
  //     "uid": userID
  //   }
  // } ) ).json();

  // document.getElementById( "loader" ).classList.add( "Util_hide" );

  await AddHodlingRowsFromJSON( HODLING );
  await AddPLRowsFromJSON( PL_LIST );

  if ( email )
    ShowNotification( `Welcome ${ email }` );

  await TestFunction( hodlingBody[ 0 ] );

  document.getElementById( "loader" ).classList.add( "Util_hide" );

  // SummationPLTable( hodlingBody );
  // SummationPLTable( plBody );

  webSocket.wsSubscribe( LiveUpdateHodlingTable );

  // AddAllHistory_FromDB( history.aquibHistory );

  hodlingBody[ 0 ].addEventListener( "click", OnClickHodlingRows() );
  // hodlingBody[ 0 ].addEventListener( "dblclick", OnDBClick_HodlingRows() );

  window.onanimationend = async ( e ) => {
    // stacksnippet"s console also has CSS animations...
    if ( e.type === "animationend" && e.target.id === notificationBTN.id )
    {
      if ( notificationBTN.textContent.includes( "Trigger Value" ) )
        await Const.delay( 2000 );
      notificationBTN.classList.remove( "visible" );
    }
  };

  document.addEventListener( "dblclick", async function ( e ) {
    // https://github.com/john-doherty/long-press-event
    // stop the event from bubbling up
    e.preventDefault();

    const targetRow = e.target.tagName === "TD" ? e.target.parentElement : e.target;

    // getting trading view of specific coin
    if ( e.target.id === "tdPairName" ) {
      const pairName = e.target.textContent;
      if ( pairName.endsWith( "usdt" ) ) {
        const pName = `BINANCE:${ pairName.toLocaleUpperCase() }`;
        TradingViewPreview( pName );
        return;
      } else {
        const parent = e.target.parentElement;
        const coin = parent.getAttribute( "coin" );
        const pair = parent.getAttribute( "pair" );
        const url = `https://wazirx.com/exchange/${ coin }-${ pair }`;
        window.open( url, "_blank" ).focus();
        return;
      }
    }

    if ( targetRow.tagName == "DIV" )
    {
      document.getElementById( "IndexContainer" ).classList.toggle( "minimized" );
      return;
    }
    if ( targetRow.tagName !== "TR" )
      return;

    if ( targetRow.classList.contains( "extra" ) )
      return ShowNotification( "Not implemented yet" );

    const isHOLDLingTable = targetRow.parentElement.parentElement.id === "table";
    if ( isHOLDLingTable ) {
      LongPressPopup.querySelector( "#btnSell" ).classList.remove( "Util_disable" );
      LongPressPopup.querySelector( "#btnSL" ).classList.remove( "Util_disable" );
      LongPressPopup.querySelector( "#btnSLValue" ).classList.remove( "Util_disable" );
    } else {
      LongPressPopup.querySelector( "#btnSell" ).classList.add( "Util_disable" );
      LongPressPopup.querySelector( "#btnSL" ).classList.add( "Util_disable" );
      LongPressPopup.querySelector( "#btnSLValue" ).classList.add( "Util_disable" );
    }

    const coinpair = targetRow.children[ 0 ].textContent.trim();
    const coinLength = coinpair.length;
    const pairStr = coinpair.substring( coinLength - 4, coinLength );
    const pair = pairStr.includes( "usdt" ) ? "usdt" : pairStr.includes( "btc" ) ? "btc" : pairStr.includes( "wrx" ) ? "wrx" : "inr";
    // const isINR = coinpair.includes( "inr" );
    const coin = coinpair.split( pair )[ 0 ];
    // const pair = isINR ? "inr" : "usdt";
    const qty = targetRow.children[ isHOLDLingTable ? 2 : 3 ].textContent;
    const buyPrice = +targetRow.children[ 1 ].textContent;
    const soldPrice = +targetRow.children[ isHOLDLingTable ? 5 : 2 ].textContent.split( " " )[ 0 ];
    const comment = targetRow.querySelector( "#tdTerm" ).textContent;

    const targetID = targetRow.id;
    // const body = { coinpair, side, qty, currentPrice: soldPrice, type, side };

    LongPressPopup.querySelector( "#btnBaseCoin" ).textContent = isHOLDLingTable ? "Move to PL" : "Move to Hodl";

    LongPressPopup.setAttribute( "data", JSON.stringify( { coin, pair, buyPrice, soldPrice, qty, comment, targetID } ) );
    LongPressPopup.classList.remove( "Util_hide" );
    // const response = await Const.fetchUtils( Routes.ORDER_POST, Method.POST, body );
    // console.log( response.msg );
  } );

  coinDetailsPopup.addEventListener( "click", async ( event ) => {
    const target = event.target;
    switch ( target.id ) {
      case "back": {
        ResetForm();
        coinDetailsPopup.classList.add( "Util_hide" );
      }
        break;
      case "next":
      {
        const isEdit = coinDetailsPopup.hasAttribute( "isEdit" );
        const targetID = coinDetailsPopup.getAttribute( "targetID" );
        const uid = localStorage.getItem( "uid" );
        const coin = coinDetailsPopup.querySelector( "#pets-name" ).value.trim().split( " " )[ 0 ].toLowerCase();
        const pair = coinDetailsPopup.querySelector( ".radio-container input[type=radio]:checked + label" ).textContent.toLowerCase();
        const qty = +coinDetailsPopup.querySelector( "#pets-breed" ).value;
        const price = +coinDetailsPopup.querySelector( "#pets-birthday" ).value;
        const buyPrice = +coinDetailsPopup.querySelector( "#pets-birthday" ).value;
        const term = coinDetailsPopup.querySelector( "#divCommentTerm" ).textContent;
        const soldPrice = +coinDetailsPopup.querySelector( "#pets-birthday2" ).value;

        const isPLList = !coinDetailsPopup.querySelector( "#divSoldPrice" ).classList.contains( "Util_hide" );

        if ( !uid || !coin || !pair || !qty || !price ) {
          const content = "<p>Please fill all the fields</p>";
          return ShowNotification( content );
        } else {
          coinDetailsPopup.classList.add( "Util_hide" );
          ResetForm();
        }
        const body = { coin, pair, qty, price, term, uid, soldPrice, buyPrice, id: targetID };

        if ( isEdit ) {
          // const response = await Const.fetchUtils((isPLList ? Routes.PL_UPDATE_POST : Routes.HODLING_UPDATE_POST), Method.POST, body)
          // console.log( response.message );
          isPLList
            ? plBody[ 0 ].children[ targetID ].remove()
            : hodlingBody[ 0 ].children[ targetID ].remove();
          isPLList
            ? await AddPLRowsFromJSON( [ body ] )
            : await AddHodlingRowsFromJSON( [ body ] );
        } else {
          const response = await Const.fetchUtils( ( isPLList ? Routes.PL_LIST_POST : Routes.HODLING_POST ), Method.POST, body );
          // console.log( response.msg );
          body.id = response.id;
          isPLList
            ? await AddPLRowsFromJSON( [ body ] )
            : await AddHodlingRowsFromJSON( [ body ] );

          return; // !return to avoid the below code
          // if ( pair === "usdt" ) {
          //   const deductUSDT = +qty * +price;
          //   let HODLING = await fetch( Routes.HODLING_POST,
          //     {
          //       method: Method.GET,
          //       headers: {
          //         "Content-Type": "application/json",
          //         uid: userID
          //       }
          //     } ).then( res => res.json() );
          //   HODLING = HODLING.message;
          //   const usdtobj = HODLING.filter( e => ( e.coin + e.pair ) === PAIR.USDT )[ 0 ];
          //   const { coin, pair: Pair, qty: usdtqty, price: usdtPrice, term, uid, soldPrice, buyPrice, _id } = usdtobj;
          //   const totalusdthodling = isPLList ? usdtqty + deductUSDT : usdtqty - deductUSDT;
          //   const body = { coin, pair: Pair, qty: totalusdthodling, price: usdtPrice, term, id: _id };
          //   const response = await Const.fetchUtils( Routes.HODLING_UPDATE_POST, Method.POST, body );
          //   await AddHodlingRowsFromJSON( [ body ], true );
          // }
        }
      }
    }

    function ResetForm () {
      coinDetailsPopup.querySelector( "#pets-name" ).value = "";
      coinDetailsPopup.querySelector( "#pets-breed" ).value = "";
      coinDetailsPopup.querySelector( "#pets-birthday" ).value = "";
      coinDetailsPopup.querySelector( "#pets-birthday2" ).value = "";
      coinDetailsPopup.querySelector( "#divCommentTerm" ).textContent = "";
      coinDetailsPopup.querySelector( "[checked]" )?.removeAttribute( "checked" );
      coinDetailsPopup.querySelector( "#pet-gender-female" ).checked = true;

      coinDetailsPopup.removeAttribute( "isEdit" );
      coinDetailsPopup.removeAttribute( "targetID" );

      coinDetailsPopup.querySelector( "#divSoldPrice" ).classList.add( "Util_hide" );
    }
  },

  hodlingCaption.addEventListener( "click", async () => {
    coinDetailsPopup.classList.remove( "Util_hide" );
    coinDetailsPopup.querySelector( "#pets-name" ).focus();
    coinDetailsPopup.querySelector( "#divSoldPrice" ).classList.add( "Util_hide" );
  } ) );

  plCaption.addEventListener( "click", () => {
    coinDetailsPopup.classList.remove( "Util_hide" );
    coinDetailsPopup.querySelector( "#pets-name" ).focus();
    coinDetailsPopup.querySelector( "#divSoldPrice" ).classList.remove( "Util_hide" );
  } );

  function AddAllHistory_FromDB ( history ) {
    const hodlingTable = document.getElementById( "tableHistory" );
    const hodlingBody = hodlingTable.getElementsByTagName( "tbody" );
    for ( const loop of history )
      for ( const coin of loop ) {
        const { symbol, type, side, status, price, origQty, createdTime } = coin;
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

  function OnDBClick_HodlingRows () {
    return ( event ) => {
      const targetRow = event.target.tagName === "TD" ? event.target.parentElement : event.target;

      if ( targetRow.tagName !== "TR" )
        return;

      ShowSLFunction( targetRow, ShowNotification );
    };
  }

  function OnClickHodlingRows () {
    return ( event ) => {
      const targetRow = event.target.tagName === "TD" ? event.target.parentElement : event.target;
      const targetID = targetRow.id;

      if ( targetRow.tagName !== "TR" )
        return;

      const existingRow = hodlingBody[ 0 ].querySelector( ".rowSelect" );
      if ( existingRow )
        if ( existingRow.id === targetID )
          existingRow.classList.remove( "rowSelect" );
        else {
          existingRow.classList.remove( "rowSelect" );
          targetRow.classList.add( "rowSelect" );
        }
      else
        targetRow.classList.add( "rowSelect" );
    };
  }

  async function TestFunction ( body = hodlingBody[ 0 ] ) {
    const sort = ( arr ) => arr.sort( ( a, b ) =>
      +a.querySelector( "#tdBuyPrice" ).textContent - +b.querySelector( "#tdBuyPrice" ).textContent
    );
    const pairs = [ "wrx", "btc", "usdt" ];
    const funds = await ( await fetch( Routes.FUNDS_GET, {
      method: Method.GET,
      headers: {
        "Content-Type": "application/json",
        uid: userID
      }
    } ) ).json();
    const coins = funds.filter( e => ( pairs.includes( e.asset ) ) );

    const childrens = body.children;
    let wrx = [];
    let usdt = [];
    let btc = [];

    for ( const child of childrens ) {
      const pairName = child.getAttribute( "pairName" );

      if ( pairName.startsWith( "wrx" ) )
        wrx.push( child );
      else if ( pairName.startsWith( "usdt" ) )
        usdt.push( child );
      else if ( pairName.startsWith( "btc" ) )
        btc.push( child );
    }

    usdt = sort( usdt );
    wrx = sort( wrx );
    btc = sort( btc );

    for ( const child of wrx ) {
      const qty = +child.querySelector( "#tdQty" ).textContent;
      child.querySelector( "#tdQty" ).setAttribute( "qty", qty );
    }

    for ( const child of usdt ) {
      const qty = +child.querySelector( "#tdQty" ).textContent;
      child.querySelector( "#tdQty" ).setAttribute( "qty", qty );
    }

    for ( const child of btc ) {
      const qty = +child.querySelector( "#tdQty" ).textContent;
      child.querySelector( "#tdQty" ).setAttribute( "qty", qty );
    }

    // await Daka( "usdt", usdt, coins );
    // await Daka( "wrx", wrx, coins );
    // await Daka( "btc", btc, coins );

    SummationPLTable( hodlingBody );
    SummationPLTable( plBody );

    MissMatchAssets( funds, childrens, ShowNotification );

    // default tradingview btn of

    // btc, btc.d, dyxy
    // loop through pairname
  }

  async function Daka ( coin, arr, coins ) {
    // ! Optimize if condition
    if ( !coins.filter( e => e.asset === coin ).length )
      return;
    let { free } = coins.filter( e => e.asset === coin )[ 0 ];
    for ( const child of arr ) {
      // child.scrollIntoView();
      // child.style.backgroundColor = "#9b6a6a";
      const tdQty = child.querySelector( "#tdQty" );
      const tdBuyPrice = child.querySelector( "#tdBuyPrice" );
      const pairName = child.querySelector( "#tdPairName" );
      const pair = pairName.textContent.split( coin )[ 1 ];
      const isINR = pair === "inr";
      const lastPairPrice = ( ( pair === "usdt" ) || ( pair === "inr" ) ) ? usdtinr : ( pair === "wrx" ) ? wrxinr : btcinr;
      const lastPrice = +child.querySelector( "#tdCurrentPrice" ).textContent.split( " " )[ 0 ];

      const attrQty = +tdQty.getAttribute( "qty" );
      if ( +free >= attrQty ) {
        free -= attrQty;
        continue;
      } else if ( +free <= attrQty ) {
        const qty = +free;

        if ( +attrQty !== qty )
          child.classList.add( "Util_disable" );
        else
          child.classList.remove( "Util_disable" );

        tdQty.textContent = qty ? qty.toFixed( 4 ) : 0;
        const price = +tdBuyPrice.textContent.split( " " )[ 0 ];

        const totalToDollar = isINR ? ( ( price / lastPairPrice ) * qty ) : ( price * qty );
        const totalToInr = totalToDollar * lastPairPrice;

        const currentTotalToDollar = isINR ? ( ( lastPrice / lastPairPrice ) * qty ) : ( lastPrice * qty );
        const currentTotalToInr = currentTotalToDollar * lastPairPrice;
        const percentage = ( ( ( currentTotalToInr * 100 ) / totalToInr ) - 100 ) || 0;

        const marginDollar = currentTotalToDollar - totalToDollar;
        const marginINR = currentTotalToInr - totalToInr;

        // child.querySelector( "#tdBuyPrice" ).textContent = price;
        // child.querySelector( "#tdQty" ).textContent = qty;
        // child.querySelector( "#tdTerm" ).textContent = term;
        child.querySelector( "#tdTotalDollar" ).textContent = totalToDollar.toFixed( 2 ) + " ₿";
        child.querySelector( "#tdTotalinr" ).textContent = totalToInr.toFixed( 2 ) + " ₹";

        child.querySelector( "#tdCurrentPrice" ).textContent = lastPrice + ( isINR ? " ₹" : " ₿" );
        child.querySelector( "#tdCurTotalDollar" ).textContent = currentTotalToDollar.toFixed( 2 ) + " ₿";
        child.querySelector( "#tdCurTotalinr" ).textContent = currentTotalToInr.toFixed( 2 ) + " ₹";
        child.querySelector( "#tdPLPercentage" ).textContent = percentage.toFixed( 2 ) + " %";
        child.querySelector( "#tdMarginDol" ).textContent = marginDollar.toFixed( 2 ) + " ₿";
        child.querySelector( "#tdMarginINR" ).textContent = marginINR.toFixed( 2 ) + " ₹";

        if ( percentage > 0 )
          child.querySelector( "#tdMarginINR" ).parentNode.classList.add( "Profit" );

        // insert row in dscending order of the table body
        const body = hodlingBody[ 0 ];
        const rows = body.children;
        let i = 0;
        for ( ; i < rows.length; i++ )
          if ( rows[ i ].querySelector( "#tdPLPercentage" ).textContent.split( " " )[ 0 ] <= percentage )
            break;

        body.insertBefore( child, rows[ i ] );
        // child.style.backgroundColor = "";
        free = 0;
      }
    }
    if ( +free > 0 ) {
      const pair = coin === "usdt" ? "inr" : "usdt";
      let qty = +free;
      qty = qty.toFixed( 8 );
      const price = +( arr[ 0 ]?.querySelector( "#tdBuyPrice" ).textContent.split( " " )[ 0 ] || ( ( coin === "usdt" ) ? usdtinr : ( coin === "btc" ? btcinr : wrxinr ) ) );
      const term = "Take Profit";
      const _id = coin + pair + "_" + new Date().getTime();
      await AddHodlingRowsFromJSON( [ { coin, pair, qty, price, term, _id } ] );
    }
  }

  function SummationPLTable ( body ) {
    const children = body[ 0 ].children;
    const footChild = body[ 0 ].nextElementSibling.children[ 0 ].children;

    let beforeDollar = 0; let beforeInr = 0; let percentage = 0; let afterDollar = 0; let afterInr = 0; let portFolio = 0;

    for ( const child of children ) {
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
      const color = lastPrice.toFixed( 2 ) === currentPrice ? "" : ( lastPrice < currentPrice ? "green" : "red" );
      footChild[ 5 ].setAttribute( "lastPrice", currentPrice );
      footChild[ 5 ].textContent = "Portfolio: " + currentPrice;
      footChild[ 5 ].style.color = color;
    }
  }

  async function AddHodlingRowsFromJSON ( obj,
                                          isUpdate = false ) {
    await UpdateFearGreedIndex( usdtinr );
    const childrens = [];
    for ( const key in obj )

      if ( obj.hasOwnProperty( key ) ) {
        const { coin, pair, qty, price, term, _id, id } = obj[ key ];
        const lastPrice = arrTicker.filter( e => e.symbol === ( coin + pair ) )[ 0 ].lastPrice;

        const lastPairPrice = ( ( pair === "usdt" ) || ( pair === "inr" ) ) ? usdtinr : ( pair === "wrx" ) ? wrxinr : btcinr;

        const row = isUpdate
          ? document.getElementById( _id || id )
          : document.getElementById( "templatePLRow" ).content.cloneNode( true );

        // add multiple attributes to the row

        const rowParent = row.getElementById( "tdPairName" ).parentElement;
        rowParent.setAttribute( "coin", coin );
        rowParent.setAttribute( "pair", pair );
        rowParent.setAttribute( "qty", qty );
        rowParent.setAttribute( "price", price );
        rowParent.setAttribute( "term", term );

        const isINR = pair === "inr";
        if ( !isUpdate ) {
          const ID = ( _id || id || key );

          rowParent.id = ID;
          if ( ID.split( "_" )[ 1 ] )
            rowParent.classList.add( "extra" );
          rowParent.setAttribute( "pairName", coin.replace( /[0-9]/g, "" ) + pair ); // regex to remove numbers to handle execptions
          if ( !coinPairArr.includes( coin + pair ) )
            coinPairArr.push( coin + pair );
        }

        const totalToDollar = isINR ? ( ( price / lastPairPrice ) * qty ) : ( price * qty );
        const totalToInr = totalToDollar * lastPairPrice;

        const currentTotalToDollar = isINR ? ( ( lastPrice / lastPairPrice ) * qty ) : ( lastPrice * qty );
        const currentTotalToInr = currentTotalToDollar * lastPairPrice;
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
          row.querySelector( "#tdMarginINR" ).parentNode.classList.add( "Profit" );

        // insert row in dscending order of the table body
        // const body = hodlingBody[0]
        const rows = childrens;
        let i = 0;
        for ( ; i < rows.length; i++ )
          if ( rows[ i ].querySelector( "#tdPLPercentage" ).textContent.split( " " )[ 0 ] <= percentage )
            break;

        // body.insertBefore(row.children[0], rows[i])
        childrens.splice( i, 0, row.children[ 0 ] );
      }
    hodlingBody[ 0 ].append( ...childrens );
  }

  async function AddPLRowsFromJSON ( obj,
    isUpdate = false ) {
    const childrens = [];
    for ( const key in obj )

      // eslint-disable-next-line no-prototype-builtins
      if ( obj.hasOwnProperty( key ) ) {
        const { coin, pair, qty, buyPrice, soldPrice, term, _id, id } = obj[ key ];
        const row = isUpdate
          ? document.querySelector( "#" + ( _id || id || key ) )
          : document.getElementById( "templatePL1Row" ).content.cloneNode( true );

        const lastPairPrice = ( ( pair === "usdt" ) || ( pair === "inr" ) ) ? usdtinr : ( pair === "wrx" ) ? wrxinr : btcinr;

        const isINR = pair === "inr";
        if ( !isUpdate )
          row.getElementById( "tdPairName" ).parentElement.id = ( _id || id || key );

        if ( !coinPairArr.includes( coin + pair ) )
          coinPairArr.push( coin + pair );

        const rowParent = row.getElementById( "tdPairName" ).parentElement;
        rowParent.setAttribute( "pairName", coin.replace( /[0-9]/g, "" ) + pair ); // regex to remove numbers to handle execptions

        const totalToDollar = isINR ? ( ( buyPrice / lastPairPrice ) * qty ) : ( buyPrice * qty );
        const totalToInr = totalToDollar * lastPairPrice;

        const currentTotalToDollar = isINR ? ( ( soldPrice / lastPairPrice ) * qty ) : ( soldPrice * qty );
        const currentTotalToInr = currentTotalToDollar * lastPairPrice;
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

        // ! rearrange the code
        const currentPrice = arrTicker.filter( e => e.symbol === ( coin + pair ) )[ 0 ].lastPrice;
        const currentPercentage = ( ( currentPrice * 100 ) / soldPrice ) - 100;
        row.querySelector( "#tdCurrentPercentage" ).textContent = currentPercentage.toFixed( 2 ) + " %";

        row.querySelector( "#tdPLPercentage" ).textContent = percentage.toFixed( 2 ) + " %";
        row.querySelector( "#tdMarginDol" ).textContent = marginDollar.toFixed( 2 ) + " ₿";
        row.querySelector( "#tdMarginINR" ).textContent = marginINR.toFixed( 2 ) + " ₹";

        if ( percentage < 0 ) {
          const parentRow = row.querySelector( "#tdMarginINR" ).parentNode.style;
          parentRow.background = "#c77777";
          parentRow.color = "#fff";
        }

        if ( !isUpdate )
          childrens.splice( 0, 0, row );
      }
    if ( !isUpdate )
      plBody[ 0 ].append( ...childrens );
  }

  async function LiveUpdateHodlingTable ( event ) {
    try {
      const array = event.data.filter( e => coinPairArr.includes( e.s ) );
      const usdtINRArray = array.filter( e => e.s === PAIR.USDT );
      const wrxINRArray = array.filter( e => e.s === PAIR.WRX );
      const btcINRArray = array.filter( e => e.s === PAIR.BTC );

      if ( usdtINRArray.length ) {
        usdtinr = usdtINRArray[ 0 ].c;
        await UpdateFearGreedIndex( usdtinr );
      }

      if ( wrxINRArray.length )
        wrxinr = wrxINRArray[ 0 ].c;

      if ( btcINRArray.length )
        btcinr = btcINRArray[ 0 ].c;

      for ( const arrs of array ) {
        const currentPrice = +arrs.c;
        // regex to remove numbers to handle execptions
        for ( const child of hodlingBody[ 0 ].querySelectorAll( "tr[pairName=" + arrs.s.replace( /[0-9]/g, "" ) + "]" ) ) {
          const lastPrice = +child.querySelector( "#tdCurrentPrice" ).textContent.split( " " )[ 0 ];
          const qty = +child.querySelector( "#tdQty" ).textContent;

          const color = lastPrice === currentPrice ? "" : lastPrice < currentPrice ? "green" : "red";
          const prevPercentage = +child.querySelector( "#tdPLPercentage" ).textContent.split( " " )[ 0 ];
          const pair = arrs.U;
          const isINR = arrs.U === "inr";

          const lastPairPrice = ( ( pair === "usdt" ) || ( pair === "inr" ) ) ? usdtinr : ( pair === "wrx" ) ? wrxinr : btcinr;

          const totalToDollar = +child.querySelector( "#tdTotalDollar" ).textContent.split( " " )[ 0 ];
          const totalToInr = +child.querySelector( "#tdTotalinr" ).textContent.split( " " )[ 0 ];

          const currentTotalToDollar = isINR ? ( ( currentPrice / lastPairPrice ) * qty ) : ( currentPrice * qty );
          const currentTotalToInr = currentTotalToDollar * lastPairPrice;
          const percentage = qty ? ( ( ( ( currentTotalToInr * 100 ) / totalToInr ) - 100 ) || 0 ) : 0;

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
            child.classList.add( "Profit" );
          } else if ( prevPercentage >= 0 && percentage.toFixed( 2 ) <= 0 ) {
            const parent = child.parentNode;
            // insert before the first row

            [ ...child.parentNode.querySelectorAll( ".Profit" ) ].length
              ? parent.insertBefore( child, [ ...child.parentNode.querySelectorAll( ".Profit" ) ].pop().nextElementSibling )
              : parent.insertBefore( child, parent.querySelector( "tr" ) );
            child.classList.remove( "Profit" );
            // move row to below top rows
          }

          // insert row in dscending order of the table body
          // const body = hodlingBody[ 0 ];
          // const rows = body.children;
          // let i = 0;
          // for ( ; i < rows.length; i++ ) {
          //   if ( rows[ i ].querySelector( "#tdPLPercentage" ).textContent.split( " " )[ 0 ] <= percentage )
          //     break;
          // }
          // body.insertBefore( child, rows[ i ] );
        }

        for ( const child of plBody[ 0 ].querySelectorAll( "tr[pairName=" + arrs.s.replace( /[0-9]/g, "" ) + "]" ) ) {
          const soldPrice = +child.querySelector( "#tdSoldPrice" ).textContent.split( " " )[ 0 ];
          const currentPercentage = ( ( currentPrice * 100 ) / soldPrice ) - 100;
          child.querySelector( "#tdCurrentPercentage" ).textContent = currentPercentage.toFixed( 2 ) + " %";
          if ( currentPercentage < 0 )
            child.querySelector( "#tdBuyAgain" ).classList.remove( "Util_disable" );
          else
            child.querySelector( "#tdBuyAgain" ).classList.add( "Util_disable" );
        }
      }
      SummationPLTable( hodlingBody );
    } catch ( error ) {
      console.log( error );
    }
  }

  async function UpdateFearGreedIndex ( usdtinr, isUpdate = false ) {
    const divFearGreedContainer = document.getElementsByClassName( "divFearGreedIndex" );
    divFearGreedContainer[ 0 ].querySelector( "#spanDollarPrice" ).textContent = usdtinr;

    if ( !isUpdate ) {
      const fearGreed = await Const.fearGreed();
      divFearGreedContainer[ 0 ].querySelector( "#spanValue" ).textContent = fearGreed.data[ 0 ].value + " %";
      divFearGreedContainer[ 0 ].querySelector( "#spanClassification" ).textContent = fearGreed.data[ 0 ].value_classification;
    }
  }
}, false );

async function MissMatchAssets ( funds, childrens, ShowNotification ) {
  await Const.delay( 1000 );
  const shariat = [];
  for ( const child of childrens ) {
    const coin = child.getAttribute( "coin" );
    const pair = child.getAttribute( "pair" );
    const qty = +child.querySelector( "#tdQty" ).textContent;
    const abc = shariat.filter( e => e.coin === coin );
    if ( abc.length )
      abc[ 0 ].qty += +qty;

    else
      shariat.push( { coin, qty: +qty, pair } );
  }

  for ( const fund of funds ) {
    const details = shariat.filter( p => p.coin === fund.asset );
    if ( details.length ) {
      const sum = details.map( item => item.qty )
        .reduce( ( a, b ) => a + b, 0 ).toString();
      const asset = ( fund.free ).toString();

      const isSumWithPrecision = sum.indexOf( "." ) > -1;
      const precisionValue = isSumWithPrecision ? ( sum.length - sum.indexOf( "." ) - 1 ) : sum.length;
      const whatToDo = isSumWithPrecision ? ( sum !== Number( asset ).toFixed( precisionValue ) ) : ( sum !== asset );
      if ( whatToDo )
        missMatchAssets.push( { coin: fund.asset, sum, asset: fund.free } );
    } else if ( fund.asset !== "inr" )
      missMatchAssets.push( { coin: fund.asset, sum: +fund.free, asset: fund.free } );
  }

  if ( missMatchAssets.length ) {
    const splice = [];
    for ( const key in missMatchAssets )

      if ( parseFloat( missMatchAssets[ key ].asset ).toFixed( 8 ).toString() ===
           parseFloat( missMatchAssets[ key ].sum ).toFixed( 8 ).toString() )
        splice.push( missMatchAssets[ key ].coin );

    missMatchAssets = missMatchAssets.filter( e => !splice.includes( e.coin ) );
    if ( missMatchAssets.length ) {
      const msg = "Miss match assets:<br><br>" + missMatchAssets.map( e => e.coin + ": " + e.sum + " vs " + e.asset ).join( "<br>" );
      ShowNotification( msg, true );
    }
  }
}

function TradingViewPreview ( pairName = "BINANCE:BTCUSDT" ) {
  const allContainers = document.querySelectorAll( ".RootContainer" );
  // eslint-disable-next-line no-new
  new TradingView.widget(
    {
      autosize: true,
      symbol: pairName,
      interval: "240",
      timezone: "UTC+05:30",
      theme: "dark",
      style: "1",
      locale: "in",
      toolbar_bg: "#f1f3f6",
      enable_publishing: false,
      hide_side_toolbar: false,
      allow_symbol_change: true,
      save_image: false,
      watchlist: [
        "BINANCE:LUNAUSDT"
      ],
      details: true,
      studies: [
        "MACD@tv-basicstudies",
        "RSI@tv-basicstudies",
        "StochasticRSI@tv-basicstudies"
      ],
      container_id: "tradingview_f888d"
    }
  );

  allContainers.forEach( ( container ) => container.classList.add( "Util_hide" ) );
  document.getElementById( "TradingView" ).classList.remove( "Util_hide" );
  sideNav.classList.toggle( "active" );
}

function CloseLongPressPopup () {
  LongPressPopup.removeAttribute( "data" );
  LongPressPopup.classList.add( "Util_hide" );
}

function ShowSLFunction ( targetRow, ShowNotification ) {
  const { getStopLossValue, currentPrice, countNumber, margin } = CalculateSLValue( targetRow );
  const content = `<p>Trigger Value at ${ getStopLossValue( currentPrice, 2, countNumber ) } <br />
    Sale Value at ${ getStopLossValue( currentPrice, 4, countNumber ) } <br />
    You get ${ getStopLossValue( margin, 4, countNumber ) } ₹</p>`;

  ShowNotification( content );
}

function CalculateSLValue ( targetRow ) {
  const countDecimals = ( value ) => {
    if ( ( value % 1 ) !== 0 )
      return value.toString().split( "." )[ 1 ].length;
    return 0;
  };

  const buyPrice = +targetRow.children[ 1 ].textContent;
  const currentPrice = +targetRow.children[ 5 ].textContent.split( " " )[ 0 ];
  const countNumber = +countDecimals( buyPrice );
  const margin = +targetRow.children[ 10 ].textContent.split( " " )[ 0 ];
  return { getStopLossValue, currentPrice, countNumber, margin };
}

function sortTable ( n, table ) {
  let rows; let switching; let i; let x; let y; let shouldSwitch; let dir; let switchcount = 0;
  // table = document.getElementById("myTable");
  switching = true;
  // Set the sorting direction to ascending:
  dir = "asc";
  /* Make a loop that will continue until
  no switching has been done: */
  while ( switching ) {
    // start by saying: no switching is done:
    switching = false;
    rows = table.querySelector( "tbody" ).children;
    /* Loop through all table rows (except the
    first, which contains table headers): */
    for ( i = 0; i < ( rows.length - 1 ); i++ ) {
      // start by saying there should be no switching:
      shouldSwitch = false;
      /* Get the two elements you want to compare,
      one from current row and one from the next: */
      x = rows[ i ].getElementsByTagName( "TD" )[ n ];
      y = rows[ i + 1 ].getElementsByTagName( "TD" )[ n ];
      /* check if the two rows should switch place,
      based on the direction, asc or desc: */

      x = +x.innerHTML.split( " ₿" )[ 0 ].split( " ₹" )[ 0 ] ? +x.innerHTML.split( " ₿" )[ 0 ].split( " ₹" )[ 0 ] : x.innerHTML.split( " ₿" )[ 0 ].split( " ₹" )[ 0 ].toLowerCase();
      y = +y.innerHTML.split( " ₿" )[ 0 ].split( " ₹" )[ 0 ] ? +y.innerHTML.split( " ₿" )[ 0 ].split( " ₹" )[ 0 ] : y.innerHTML.split( " ₿" )[ 0 ].split( " ₹" )[ 0 ].toLowerCase();

      if ( dir === "asc" ) {
        if ( x > y ) {
          // if so, mark as a switch and break the loop:
          shouldSwitch = true;
          break;
        }
      } else if ( dir === "desc" )
        if ( x < y ) {
          // if so, mark as a switch and break the loop:
          shouldSwitch = true;
          break;
        }
    }
    if ( shouldSwitch ) {
      /* If a switch has been marked, make the switch
      and mark that a switch has been done: */
      rows[ i ].parentNode.insertBefore( rows[ i + 1 ], rows[ i ] );
      switching = true;
      // Each time a switch is done, increase this count by 1:
      switchcount++;
    } else
    /* If no switching has been done AND the direction is "asc",
      set the direction to "desc" and run the while loop again. */
    if ( switchcount === 0 && dir === "asc" ) {
      dir = "desc";
      switching = true;
    }
  }
}
