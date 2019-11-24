const mongoose = require("mongoose");
const timestamps = require("mongoose-timestamp");
const Schema = mongoose.Schema;

const UserProfileSchema = new Schema({
	user: {
		type: Schema.Types.ObjectId,
		ref: "User",
		required: true
	},

	location: {
		type: Schema.Types.ObjectId,
		ref: "Location"
	},

	imageUrl: String,

	address: {
		type: String,
		trim: true
	},

	street: {
		type: String,
		trim: true
	},

	city: {
		type: String,
		trim: true
	},

	state: {
		type: String,
		trim: true
	},

	zipCode: {
		type: Number
	},

	isDeleted: {
		type: Boolean,
		default: false
	}
});

UserProfileSchema.plugin(timestamps);

module.exports = mongoose.model("UserProfile", UserProfileSchema);
