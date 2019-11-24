const UserProfile = require("../models/UserProfile");

module.exports = async (req, res, next) => {
	try {
		if (!req.user) {
			return res.status(401).json({
				success: false,
				message: "You were not even logged in yet"
			});
		}

		const profile = await UserProfile.findOne({ user: req.user._id, isDeleted: false });

		req.userPrifile = profile;

		return next();
	} catch (error) {
		console.log(error);
		return res.status(500).json({
			success: false,
			message: "An error occured while processing your request"
		});
	}
};
