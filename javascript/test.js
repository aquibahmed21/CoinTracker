const baseURL = "wss://stream.wazirx.com/stream";

// const ws = new WebSocket( baseURL );

// const json = { "event": "subscribe", "streams": [ "!ticker@arr" ] };
// const parsedJson = JSON.stringify( json );
// let isWSConnected = false;
// ws.onmessage = ( event =>
// {
// 	if (!isWSConnected && JSON.parse( event.data ).event == "connected" )
// 	{
// 		isWSConnected = true;
// 		ws.send( parsedJson );
// 	}
// 	else if( isWSConnected )
// 	{
// 		console.log( JSON.parse( event.data ) );
// 	}
// } );

