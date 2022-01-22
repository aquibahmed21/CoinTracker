"use strict";

const baseURL = "wss://stream.wazirx.com/stream";

const ws = new WebSocket( baseURL );

let isWSConnected = false;
let subsCallback = null;

ws.onmessage = ( event =>
{
	const json = JSON.parse( event.data );
	if (!isWSConnected && json.event == "connected" )
		isWSConnected = true;
	else if( isWSConnected && subsCallback)
	{
		if ( !json.event || (json.event && json.event != "subscribed"));
			subsCallback(json);
	}
});

function wsSubscribe ( callback = null )
{
	if ( ws && isWSConnected )
	{
		ws.send( JSON.stringify( { "event": "subscribe", "streams": [ "!ticker@arr" ] } ) );
		subsCallback = callback;
	}
}

export { wsSubscribe };