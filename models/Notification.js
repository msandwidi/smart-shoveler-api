const mongoose = require("mongoose");
const timestamps = require("mongoose-timestamp");
const Schema = mongoose.Schema;

const NotificationSchema = new Schema({
	userId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User"
	},

	type: {
		type: String,
		trim: true,
		required: true
	},

	content: {
		type: String,
		trim: true,
		required: true
	},

	isDismissed: {
		type: Boolean,
		default: false
	},

	isDeleted: {
		type: Boolean,
		default: false
	}
});

NotificationSchema.plugin(timestamps);

NotificationSchema.statics.findRescent = function(userId) {
	const Notification = this;
	return Notification.find({
		userId,
		isDeleted: false
	}).select("content type isDismissed createdAt");
};

NotificationSchema.statics.dismissAll = function(userId) {
	const Notification = this;
	return Notification.updateMany(
		{
			userId,
			isDeleted: false,
			isDismissed: false
		},
		{
			isDismissed: true
		}
	);
};

module.exports = mongoose.model("Notification", NotificationSchema);
