const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const OrderSchema = new Schema({
	user: {
		type: Schema.Types.ObjectId,
		ref: "User"
	},
	email: {
		type: String,
		trim: true
	},
	type: {
		type: String,
		trim: true
	},
	confirmation: {
		type: Number
	},
	description: String,
	date: {
		type: Date,
		default: Date.now()
	},
	isRecurrent: {
		type: Boolean,
		default: false
	},

	isDeleted: {
		type: Boolean,
		default: false
	},
	createdAt: {
		type: Date,
		default: Date.now()
	},
	updatedAt: {
		type: Date,
		default: Date.now()
	}
});


module.exports = mongoose.model("Order", OrderSchema);
