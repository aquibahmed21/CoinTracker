require( 'dotenv' ).config();

const express = require( "express" );
const fetch = require( "node-fetch" );
const CryptoJS = require( "crypto-js" );
const router = express.Router();

const signature = ( queryData, secret ) => CryptoJS.HmacSHA256( queryData, secret ).toString( CryptoJS.enc.Hex );

// @route 		GET api/funds
// @desc 			Get
// @access 		Public
router.get( "/", async ( req, res ) =>
{
	const queryData = "recvWindow=20000&timestamp=" + ( new Date().getTime() );
	const api = "/sapi/v1/funds";
	const burl = process.env.BASE_URL + api + "?" + queryData + "&signature=" + signature( queryData, process.env.SECRET_KEY );

	try {
		const rawResponse = await fetch( burl,
			{
				method: "GET",
				headers: {
					"X-Api-Key": process.env.API_KEY,
				},
			} );

		const content = await rawResponse.json();
		const fundsHodling = content.filter( e => Number( e.free ) );
		res.status( 200 ).json( fundsHodling );

	} catch ( error ) {
		res.status( 500 ).json( error );
	}
} );

module.exports = router;