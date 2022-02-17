if ( process.env.NODE_ENV !== "production" ) {
	require( "dotenv" ).config();
}

const express = require( "express" );
const router = express.Router();
const { check, validationResult } = require( "express-validator" );

const Keys = require( "../../models/Keys" );

// @route 		GET api/users
// @desc 			Register User
// @access 		Public

router.get( "/", async ( req, res ) =>
{
	// Get header from request
	const uid = req.headers[ "uid" ];
	let record = null;
	if ( uid )
		record = await Keys.find( { uid } );
	// else
	// 	record = await Keys.find();
	res.status( 200 ).json( { status: ( record && record.length ) ? "success" : "invalid", message: record } );
} );

router.post( "/", [
	check( "api", "API_KEY Required" ).not().isEmpty(),
	check( "sec", "SECRET_KEY Required" ).not().isEmpty(),
	check( "uid", "Provide User ID" ).not().isEmpty()
], async ( req, res ) =>
{
	const errors = validationResult( req );
	const { api, sec, uid } = req.body;

	if ( !errors.isEmpty() )
		return res.status( 200 ).json( { status: "invalid", message: errors.array() } );

	let user = await Keys.findOne( { uid } );
	if ( user )
		return res
			.status( 200 )
			.json( { status: "success", message: "User already exists" } );

	try {
		const API_Keys = new Keys( {
			api,
			sec,
			uid
		} );
		await API_Keys.save();
		return res.status( 200 ).json( { status: "success", message: "Credentials Added" } );

		// return jsonwebtoken
	} catch ( error ) {
		return res.status( 200 ).json( { status: "invalid", message: errors } );
	}
} );

module.exports = router;