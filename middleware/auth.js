require( 'dotenv' ).config();
const jwt = require( "jsonwebtoken" );

module.exports = function ( req, res, next )
{
	// ! GET token from header
	const token = req.header( "x-auth-token" );

	// check if !token
	if ( !token ) {
		return res.status( 401 ).json( { msg: "No token, authorization denied" } );
	}

	// Verify token
	try {
		console.log(process.env.JWT_SECRET)
		const decoded = jwt.verify( token, process.env.JWT_SECRET );
		req.user = decoded.user;
		next();
	} catch ( error ) {
		res.status( 401 ).json( { msg: "Token is not valid" } );
	}
};