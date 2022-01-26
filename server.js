"use strict";

require( 'dotenv' ).config();
const express = require( "express" );
const connectDB = require( "./config/db" );

const app = express();
const PORT = process.env.PORT || 5000;

// Connect Database;
connectDB();

// Init Middleware
app.use( express.json() );
app.use( express.urlencoded( { extended: false } ) );

// Define Routes
app.use( "/api/users", require( "./routes/api/user" ) );
app.use( "/api/auth", require( "./routes/api/auth" ) );
app.use( "/api/hodling", require( "./routes/api/hodling" ) );
app.use( "/api/pllist", require( "./routes/api/pllist" ) );


app.get( '/', ( req, res ) =>
{
	res.status( 200 ).send("API running");
} );


app.listen(PORT, () => console.log("listening to " + PORT));