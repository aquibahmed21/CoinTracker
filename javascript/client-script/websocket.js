"use strict";

const baseURL = "wss://stream.wazirx.com/stream";
const ws = new WebSocket( baseURL );

let isWSConnected = false;
let subsCallback = null;

ws.onmessage = ( event =>
{
	const json = JSON.parse( event.data );
	if ( !isWSConnected && json.event == "connected" )
		isWSConnected = true;
	else if ( isWSConnected && subsCallback ) {
		if ( !json.event || ( json.event && json.event != "subscribed" ) );
		subsCallback( json );
	}
} );

function wsSubscribe ( callback = null )
{
	if ( ws && isWSConnected ) {
		const subscribeTicker = { "event": "subscribe", "streams": [ "!ticker@arr" ] };
		const unSubscribeTicker = { "event": "unsubscribe", "streams": [ "!ticker@arr" ] };

		ws.send( JSON.stringify( subscribeTicker ) );
		if ( !subsCallback ) {
			document.addEventListener( "visibilitychange", () =>
			{
				( document.visibilityState === "visible" ) ?
					ws.send( JSON.stringify( subscribeTicker ) ) :
					ws.send( JSON.stringify( unSubscribeTicker ) );
			} );
		}
		subsCallback = callback;
	}
}

export { wsSubscribe };