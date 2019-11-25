const ProviderProfile = require("../models/ProviderProfile");
const User = require("../models/User");
const Location = require("../models/Location");

const authenticate = require("../middlewares/user_auth");

const post_providers_pool = async (req, res) => {
	try {
		const { zipCode } = req.body;

		const profiles = await User.find({ isPublic: true, isDeleted: false, zipCode });

		res.status(200).json({
			success: true,
			profiles
		});
	} catch (error) {
		console.log(error);

		res.status(500).json({
			success: false,
			message: "An error occured"
		});
	}
};

const put_toggle_profile_status = async (req, res) => {
	try {
		const profile = await User.findOne({ _id: req.user._id, isProvider: true });

		if (!profile) {
			res.status(400).json({
				success: false,
				message: "Your profile is not set"
			});
		}

		profile.isPublic = !profile.isPublic;
		profile = profile.save();

		res.status(200).json({
			success: true,
			profile
		});
	} catch (error) {
		console.log(error);

		res.status(500).json({
			success: false,
			message: "An error occured"
		});
	}
};

const get_providers_in_my_area = async (req, res) => {
	try {
		const profiles = await ProviderProfile.find({ isPublic: true, isDeleted: false, zipCode: req.user.zipCode });

		res.status(200).json({
			success: true,
			profiles
		});
	} catch (error) {
		console.log(error);

		res.status(500).json({
			success: false,
			message: "An error occured"
		});
	}
};

const post_set_my_provider_profile = async (req, res) => {
	try {
		if (req.user.isProvider)
			res.status(400).json({
				success: false,
				message: "Your account is already configured"
			});

		const { nickname, street, city, state, zipCode, description } = req.body;

		let profile = await User.findOne({
			_id: req.user._id
		});

		profile.nickname = nickname;
		profile.street = street;
		profile.city = city;
		profile.state = state;
		profile.description = description;
		profile.zipCode = zipCode;

		profile = await profile.save();

		res.status(200).json({
			success: true,
			profile
		});
	} catch (error) {
		console.log(error);

		res.status(500).json({
			success: false,
			message: "An error occured"
		});
	}
};

const get_view_profile = async (req, res) => {
	try {
		const id = req.params.id;

		const profile = await ProviderProfile.findOne({
			_id: id,
			isDeleted: false,
			isPublic: true
		});

		if (!profile)
			res.status(404).json({
				success: false,
				message: "The selected profile cannot be found"
			});

		res.status(200).json({
			success: true,
			profile
		});
	} catch (error) {
		console.log(error);

		res.status(500).json({
			success: false,
			message: "An error occured"
		});
	}
};

module.exports = (app) => {
	app.post("/api/v1/providers/pool", post_providers_pool);
	app.post("/api/v1/providers/pool/:id", get_view_profile);
	app.put("/api/v1/providers/my/status", authenticate, put_toggle_profile_status);
	app.get("/api/v1/providers/nearby", authenticate, getProfile, get_providers_in_my_area);
	app.post("/api/v1/providers/my/setup", authenticate, post_set_my_provider_profile);
};
