const mongoose = require( "mongoose" );

const UserSchema = new mongoose.Schema( {
	coin: {
		type: String,
		required: true,
	},
	pair: {
		type: String,
		required: true,
	},
	qty: {
		type: Number,
		required: true,
	},
	buyPrice: {
		type: Number,
		required: true,
	},
	soldPrice: {
		type: Number,
		required: true,
	},
	term: {
		type: String,
		required: true,
	},
	uid: {
		type: String,
		required: true
	}
} );

module.exports = PLlist = mongoose.model( "PLlist", UserSchema );