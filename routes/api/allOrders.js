if ( process.env.NODE_ENV !== "production" ) {
	require( "dotenv" ).config();
}

const express = require( "express" );
const fetch = require( "node-fetch" );
const CryptoJS = require( "crypto-js" );
const router = express.Router();

const API = {
	TICKER: "/sapi/v1/tickers/24hr",
	ALLORDERBOOK: "/sapi/v1/allOrders",
};

const Method = {
	GET: "GET",
	POST: "POST"
};

const delay = ( ms ) => new Promise( ( res ) => setTimeout( res, ms ) );
const signature = ( queryData, secret ) => CryptoJS.HmacSHA256( queryData, secret ).toString( CryptoJS.enc.Hex );

// @route 		GET api/allOrders
// @desc 			Get
// @access 		Public
router.get( "/", async ( req, res ) =>
{
	let symbol = "",
		queryData = "",
		rawResponse = null,
		content = null;

	const arr = [];
	const arrHistory = [];
	const baseURL = process.env.BASE_URL;

	const fullUrl = req.protocol + '://' + req.get( 'host' ); //+ req.originalUrl;
	const { message: credentials } = await ( await fetch( `${ fullUrl }/api/keys`, {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
			"uid": uid
		}
	} ) ).json().catch( ( error ) => console.log( error ) );

	const { api: API_KEY, sec: SECRET_KEY } = credentials[ 0 ];

	let burl = baseURL + API.TICKER;

	try {
		// !-----------------
		// ! Get Ticker
		rawResponse = await fetch( burl,
			{
				method: Method.GET,
				headers: {
					// "Accept": "application/json",
					// "Content-Type": "application/json",
					"X-Api-Key": API_KEY,
				},
			} );

		// ! Get Symbols from Ticker
		content = await rawResponse.json();
		content.forEach( e => arr.push( e.symbol ) );
		// !-----------------


		for ( symbol of arr ) {
			queryData = `symbol=${ symbol }&recvWindow=20000&timestamp=` + ( new Date().getTime() );
			burl = baseURL + API.ALLORDERBOOK + "?" + queryData +
				"&signature=" + signature( queryData, SECRET_KEY );

			// !-----------------
			// ! Get All Order Book from each symbol
			rawResponse = await fetch( burl,
				{
					method: Method.GET,
					headers: {
						// "Accept": "application/json",
						// "Content-Type": "application/json",
						"X-Api-Key": API_KEY,
					},
				} );

			content = await rawResponse.json();
			console.log( { content: content } );
			await delay( 2100 );
			// !-----------------

			// ! Push to Array
			if ( content && content.length )
				arrHistory.push( content );
		}

		res.status( 200 ).json( arrHistory );

	} catch ( error ) {
		res.status( 500 ).json( error );
	}
} );

module.exports = router;