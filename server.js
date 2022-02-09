"use strict";

require( 'dotenv' ).config();
const express = require( "express" );
const auth = require( "./middleware/auth" );
const connectDB = require( "./config/db" );

const path = require( 'path' );
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.options('*', cors());

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

app.get( '/', ( req, res ) =>
{
	res.status( 200).sendFile(path.join(__dirname, "/html/signin.html"));
} );

app.get( "/dashboard", ( req, res ) =>
{
	res.status( 200 ).sendFile( path.join( __dirname, 'index.html' ) );
} );

app.listen( PORT, () => console.log( "listening to " + PORT ) );
