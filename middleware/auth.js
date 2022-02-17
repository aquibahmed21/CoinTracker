if ( process.env.NODE_ENV !== "production" ) {
	require( "dotenv" ).config();
}
const jwt = require( "jsonwebtoken" );

module.exports = function ( req, res, next )
{
	// ! GET token from header
	const token = req.header( "x-auth-token" );

	// check if !token
	if ( !token )
		res.status( 200 ).json( { status: "invalid", msg: "No token, authorization denied" } );

	// Verify token
	try {
		const decoded = jwt.verify( token, process.env.JWT_SECRET );
		req.user = decoded.user;
		next();
	} catch ( error ) {
		res.status( 200 ).json( { status: "invalid", msg: "Token is not valid" } );
	}
};