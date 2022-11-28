"use strict";
if ( process.env.NODE_ENV !== "production" )
  require( "dotenv" ).config();

const express = require( "express" );
const connectDB = require( "./config/db" );
const fetch = require( "node-fetch" );
const CryptoJS = require( "crypto-js" );

const path = require( "path" );
const cors = require( "cors" );

const app = express();
const PORT = process.env.PORT || 3000;

console.log( "PORT: ", process.env.PORT );

app.use( cors() );
app.options( "*", cors() );

// Connect Database;
connectDB();

// Init Middleware
app.use( express.json() );
app.use( express.urlencoded( { extended: true } ) );
app.use( express.static( __dirname, { index: false } ) );

// Define Routes
app.use( "/api/users", require( "./routes/api/user" ) );
app.use( "/api/auth", require( "./routes/api/auth" ) );
app.use( "/api/hodling", require( "./routes/api/hodling" ) );
app.use( "/api/pllist", require( "./routes/api/pllist" ) );
app.use( "/api/funds", require( "./routes/api/funds" ) );
app.use( "/api/order", require( "./routes/api/order" ) );
app.use( "/api/allOrders", require( "./routes/api/allOrders" ) );
app.use( "/api/keys", require( "./routes/api/keys" ) );

app.get( "/", ( req, res ) => {
  res.status( 200 ).sendFile( path.join( __dirname, "/html/signin.html" ) );
} );

app.get( "/dashboard", ( req, res ) => {
  res.status( 200 ).sendFile( path.join( __dirname, "index.html" ) );
} );

app.get( "/cancelAllOrders", async ( req, res ) => {
  // const uid = req.headers.uid;

  const fullUrl = req.protocol + "://" + req.get( "host" ); // + req.originalUrl;
  console.log( { fullUrl } );

  // const { message: credentials } = await ( await fetch( `${ fullUrl }/api/keys`, {
  //   method: "GET",
  //   headers: {
  //     "Content-Type": "application/json",
  //     "uid": uid
  //   }
  // } ) ).json().catch( ( error ) => console.log( error ) );

  // const { api: API_KEY, sec: SECRET_KEY } = credentials[ 0 ];

  // const baseURL = process.env.BASE_URL;
  // const signature = ( queryData, secret ) => CryptoJS.HmacSHA256( queryData, secret ).toString( CryptoJS.enc.Hex );
  // const queryData = "&symbol=wrxinr&recvWindow=60000&timestamp=" + ( new Date().getTime() );

  // // const Route_Order_API = "/sapi/v1/openOrders";
  // // const burl = baseURL + Route_Order_API + "?" + queryData + "&signature=" + signature( queryData, SECRET_KEY );

  // // const queryData = "symbol=wrxinr&recvWindow=20000&timestamp=" + ( new Date().getTime() );
  // const apiURL = "/sapi/v1/openOrders";
  // const burl = baseURL + apiURL + "?" + queryData + "&signature=" + signature( queryData, SECRET_KEY );

  // try {

  //   const rawResponse = await fetch( burl,
  //     {
  //       method: "DELETE",
  //       headers: {
  //         // "Content-Type": "application/json",
  //         "Content-Type": "application/x-www-form-urlencoded",
  //         "X-Api-Key": API_KEY,
  //       },
  //     } );

  //   const content = await rawResponse.json();
  //   res.status( 200 ).json( content );

  // } catch ( error ) {
  //   res.status( 500 ).json( error );
  // }
} );

app.get( "/openOrder", async ( req, res ) => {
  const uid = process.env.UID || req.headers.uid;

  const fullUrl = req.protocol + "://" + req.get( "host" ); // + req.originalUrl;
  // eslint-disable-next-line template-curly-spacing
  const { message: credentials } = await ( await fetch( `${ fullUrl }/api/keys`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      uid
    }
  } ) ).json().catch( ( error ) => console.log( error ) );

  const { api: API_KEY, sec: SECRET_KEY } = credentials[ 0 ];

  const baseURL = process.env.BASE_URL;
  const signature = ( queryData, secret ) => CryptoJS.HmacSHA256( queryData, secret ).toString( CryptoJS.enc.Hex );
  const queryData = "recvWindow=20000&timestamp=" + ( new Date().getTime() );

  const RouteOrderAPI = "/sapi/v1/openOrders";
  const burl = baseURL + RouteOrderAPI + "?" + queryData + "&signature=" + signature( queryData, SECRET_KEY );

  // return;
  try {
    const rawResponse = await fetch( burl,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "X-Api-Key": API_KEY
        }
      } );

    const content = await rawResponse.json();
    res.status( 200 ).json( content );
  } catch ( error ) {
    res.status( 500 ).json( error );
  }
} );

app.listen( PORT, () => console.log( "listening to " + PORT ) );
