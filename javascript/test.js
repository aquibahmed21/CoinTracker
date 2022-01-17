const baseURL = "wss://stream.wazirx.com/stream";

const ws = new WebSocket( baseURL );

let isWSConnected = false;
let subsCallback = null;

ws.onmessage = ( event =>
{
	if (!isWSConnected && JSON.parse( event.data ).event == "connected" )
	{
		isWSConnected = true;
		// ws.send( parsedJson );
	}
	else if( isWSConnected && subsCallback)
	{
		const json = JSON.parse( event.data );
		if ( !json.event || (json.event && json.event != "subscribed"));
			subsCallback(json);
	}
});

function wsSubscribe ( arr, callback = null )
{
	if ( ws && isWSConnected )
	{
		ws.send(JSON.stringify({"event":"subscribe","streams":["!ticker@arr"]}))
		subsCallback = callback;
	}
}

export { wsSubscribe };