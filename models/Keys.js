const mongoose = require( "mongoose" );

const UserSchema = new mongoose.Schema( {
	api: {
		type: String,
		required: true,
	},
	sec: {
		type: String,
		required: true,
	},
	uid: {
		type: String,
		required: true
	}
} );

module.exports = Keys = mongoose.model( "Keys", UserSchema );