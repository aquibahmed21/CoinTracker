require( 'dotenv' ).config();

const express = require( "express" );
const fetch = require( "node-fetch" );
const CryptoJS = require( "crypto-js" );
const router = express.Router();

const delay = ( ms ) => new Promise( ( res ) => setTimeout( res, ms ) );

const API = {
	TICKER: "/sapi/v1/tickers/24hr",
	ALLORDERBOOK: "/sapi/v1/allOrders",
};

const Method = {
	GET: "GET",
	POST: "POST"
};

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
	const timer = 2100;

	let burl = baseURL + API.TICKER;

	try
	{
		rawResponse = await fetch( burl,
		{
			method: Method.GET,
			headers: {
				// 'Accept': 'application/json',
				// 'Content-Type': 'application/json',
				'X-Api-Key': process.env.API_KEY,
			},
			} );
		content = await rawResponse.json();
		content.forEach( e => arr.push( e.symbol ) );

		for ( symbol of arr )
		{
			console.log( { symbol } );
			await delay( timer );
			queryData = `symbol=${ symbol }&recvWindow=20000&timestamp=` + ( new Date().getTime() );
			burl = baseURL + API.ALLORDERBOOK + "?" + queryData +
						 "&signature=" + signature( queryData, process.env.SECRET_KEY );

			rawResponse = await fetch( burl,
				{
					method: Method.GET,
					headers: {
						// 'Accept': 'application/json',
						// 'Content-Type': 'application/json',
						'X-Api-Key': process.env.API_KEY,
					},
				});

			content = await rawResponse.json();
			if ( content )
				arrHistory.push( content );
		}

		res.status( 200 ).json(arrHistory );

	} catch (error) {
		res.status( 500 ).json( error );
	}
} );

module.exports = router;