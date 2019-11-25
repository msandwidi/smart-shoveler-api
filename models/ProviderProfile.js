const mongoose = require("mongoose");
const timestamps = require("mongoose-timestamp");
const Schema = mongoose.Schema;

const ProviderProfileSchema = new Schema({
	user: {
		type: Schema.Types.ObjectId,
		ref: "User",
		required: true
	},

	name: {
		type: String,
		trim: true,
		required: true
	},

	location: {
		type: Schema.Types.ObjectId,
		ref: "Location"
	},

	imageUrl: {
		type: String,
		default: "https://res.cloudinary.com/smimages/image/upload/c_scale,h_40/v1574617110/defaultprofile_md.png"
	},

	rating: Number,

	info: {
		type: String,
		trim: true
	},

	isPublic: {
		type: Boolean,
		default: false
	},

	isDeleted: {
		type: Boolean,
		default: false
	}
});

ProviderProfileSchema.plugin(timestamps);

module.exports = mongoose.model("ProviderProfile", ProviderProfileSchema);
