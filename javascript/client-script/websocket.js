"use strict";

const baseURL = "wss://stream.wazirx.com/stream";
let ws = new WebSocket( baseURL );
const pingTimeout = 60000 * 15;

let subsCallback = null;

function wsSubscribe ( callback = null ) {
  subsCallback = callback;
}

function EnableDisableTicker ( isEnable = true ) {
  const subscribeTicker = { event: "subscribe", streams: [ "!ticker@arr" ] };
  const unSubscribeTicker = { event: "unsubscribe", streams: [ "!ticker@arr" ] };

  ws.send( JSON.stringify( isEnable ? subscribeTicker : unSubscribeTicker ) );
}

function PingPongWSConnection ( ws ) {
  setInterval( () => {
    ws.send( JSON.stringify( { event: "ping" } ) );
  }, pingTimeout );
}

ws.onopen = event => {
  EnableDisableTicker();
  PingPongWSConnection( ws );
};

ws.onmessage = event => {
  if ( ![ "connected", "subscribed", "unsubscribed", "ping", "pong" ].includes( JSON.parse( event.data ).event ) && subsCallback )
    subsCallback( JSON.parse( event.data ) );
  else
    console.warn( { msg: event.data } );
};
ws.onclose = event => {
  ws = null;
  console.error( {close: event} );

  if ( ws == null ) {
    clearTimeout( pingTimeout );
    ws = new WebSocket( baseURL );
  }
};
ws.onerror = event => console.error( {error: event} );

export { wsSubscribe };
