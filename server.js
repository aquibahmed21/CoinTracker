"use strict";

require( 'dotenv' ).config();
const express = require( "express" );
const connectDB = require( "./config/db" );

const app = express();
const PORT = process.env.PORT || 5000;

// Connect Database;
connectDB();

app.get( '/', ( req, res ) =>
{
	res.status( 200 ).send("API running");
} );

app.listen(PORT, () => console.log("listening to " + PORT));