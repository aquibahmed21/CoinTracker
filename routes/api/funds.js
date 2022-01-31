require( 'dotenv' ).config();

const express = require( "express" );
const fetch = require( "node-fetch" );
const router = express.Router();

// @route 		GET api/funds
// @desc 			Get
// @access 		Public
router.get( "/", async ( req, res ) =>
{
	const baseURL = process.env.BASE_URL;
	const signature = ( queryData, secret ) => CryptoJS.HmacSHA256( queryData, secret ).toString( CryptoJS.enc.Hex );
	const queryData = "symbol=shibusdt&recvWindow=20000&timestamp=" + (new Date().getTime());
			// const queryData = "recvWindow=20000&timestamp=" + ( new Date().getTime() );
	const api = "/sapi/v1/funds";
	const burl = baseURL + api + "?" + queryData + "&signature=" + signature( queryData, process.env.SECRET_KEY );

	try
	{
		const rawResponse = await fetch( burl,
		{
			method: 'GET',
			headers: {
				// 'Accept': 'application/json',
				// 'Content-Type': 'application/json',
				'X-Api-Key': process.env.API_KEY,
			},
		});

		const content = await rawResponse.json();
		const fundsHodling = content.filter(e => Number(e.free))
		res.status( 200 ).json( fundsHodling );

	} catch (error) {
		res.status( 500 ).json( error );
	}
} );

module.exports = router;