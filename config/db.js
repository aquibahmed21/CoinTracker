"use strict";

if ( process.env.NODE_ENV !== "production" ) {
	require( "dotenv" ).config();
}
const mongoose = require( "mongoose" );
const db = process.env.DB_Connection_String;

const connectDB = async () =>
{
	try {
		await mongoose.connect( db, { useNewUrlParser: true } );
		console.log( "mongoDB Connected..." );
	} catch (error) {
		console.log( error );
		// Exit process with failure
		process.exit( 1 );
	}
}

module.exports = connectDB;