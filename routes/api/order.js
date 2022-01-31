require( 'dotenv' ).config();

const express = require( "express" );
const fetch = require( "node-fetch" );
const router = express.Router();

// @route 		GET api/funds
// @desc 			Get
// @access 		Public
router.get( "/", async ( req, res ) =>
{

	// const { coinpair, side, qty, currentPrice, type } = req.body;
	// res.status( 200 ).json( { coinpair, side, qty, currentPrice, type } );

	const baseURL = process.env.BASE_URL;
	const signature = ( queryData, secret ) => CryptoJS.HmacSHA256( queryData, secret ).toString( CryptoJS.enc.Hex );
	// const queryData = "symbol=wrxusdt&side=buy&type=limit&price=500&quantity=1&recvWindow=10000&timestamp=" + ( new Date().getTime() );
	const queryData = "symbol=ftmusdt&side=sell&type=limit&price=2.0874&quantity=1.5&recvWindow=10000&timestamp=" + ( new Date().getTime() );

	const api = "/sapi/v1/order/";
	const burl = baseURL + api + "?" + queryData + "&signature=" + signature( queryData, process.env.SECRET_KEY );


	try
	{
		const rawResponse = await fetch( burl,
		{
			method: 'POST',
			headers: {
				"Content-Type": "application/json",
				"Content-Type": "application/x-www-form-urlencoded",
				'X-Api-Key': process.env.API_KEY,
			},
		});

		const content = await rawResponse.json();
		// const fundsHodling = content.filter(e => Number(e.free))
		res.status( 200 ).json( content );

	} catch (error) {
		res.status( 500 ).json( error );
	}
} );

module.exports = router;