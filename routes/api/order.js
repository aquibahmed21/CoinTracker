require( 'dotenv' ).config();

const express = require( "express" );
const fetch = require( "node-fetch" );
const CryptoJS = require( "crypto-js" );
const router = express.Router();

// @route 		GET api/order
// @desc 			Get
// @access 		Public

router.post( "/", async ( req, res ) =>
{
	const { coinpair, side, qty, currentPrice, type } = req.body;

	const baseURL = process.env.BASE_URL;
	const signature = ( queryData, secret ) => CryptoJS.HmacSHA256( queryData, secret ).toString( CryptoJS.enc.Hex );
	const queryData = `symbol=${coinpair}&side=${side}&type=${type}&price=${currentPrice}&quantity=${qty}&recvWindow=10000&timestamp=` + ( new Date().getTime() );

	const api = "/sapi/v1/order/";
	const burl = baseURL + api + "?" + queryData + "&signature=" + signature( queryData, process.env.SECRET_KEY );

	// try
	// {
	// 	const rawResponse = await fetch( burl,
	// 	{
	// 		method: 'POST',
	// 		headers: {
	// 			"Content-Type": "application/json",
	// 			"Content-Type": "application/x-www-form-urlencoded",
	// 			'X-Api-Key': process.env.API_KEY,
	// 		},
	// 	});

	// 	const content = await rawResponse.json();
	// 	res.status( 200 ).json( content );

	// } catch (error) {
	// 	res.status( 500 ).json( error );
	// }

} );

module.exports = router;