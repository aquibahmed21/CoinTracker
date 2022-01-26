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
	price: {
		type: Number,
		required: true,
	},
	term: {
		type: String,
		required: true,
	}
} );

module.exports = Hodling = mongoose.model( "Hodling", UserSchema );
