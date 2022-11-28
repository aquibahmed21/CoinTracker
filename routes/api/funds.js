if ( process.env.NODE_ENV !== "production" )
  require( "dotenv" ).config();

const express = require( "express" );
const fetch = require( "node-fetch" );
const CryptoJS = require( "crypto-js" );
const router = express.Router();

const signature = ( queryData, secret ) => CryptoJS.HmacSHA256( queryData, secret ).toString( CryptoJS.enc.Hex );

// @route 		GET api/funds
// @desc 			Get
// @access 		Public
router.get( "/", async ( req, res ) => {
  const uid = req.headers.uid;
  const fullUrl = req.protocol + "://" + req.get( "host" ); // + req.originalUrl;
  const { message: credentials } = await ( await fetch( `${ fullUrl }/api/keys`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      uid
    }
  } ) ).json().catch( ( error ) => console.log( error ) );

  const { api: API_KEY, sec: SECRET_KEY } = credentials[ 0 ];

  const queryData = "recvWindow=20000&timestamp=" + ( new Date().getTime() );
  const apiURL = "/sapi/v1/funds";
  const burl = process.env.BASE_URL + apiURL + "?" + queryData + "&signature=" + signature( queryData, SECRET_KEY );

  try {
    const rawResponse = await fetch( burl,
      {
        method: "GET",
        headers: {
          "X-Api-Key": API_KEY
        }
      } );

    const content = await rawResponse.json();
    const fundsHodling = content.filter( e => Number( e.free ) );
    res.status( 200 ).json( fundsHodling );
  } catch ( error ) {
    res.status( 500 ).json( error );
  }
} );

module.exports = router;
