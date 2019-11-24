const ProviderProfile = require("../models/ProviderProfile");
const Location = require("../models/Location");

const authenticate = require("../middlewares/user_auth");

const getProfile = require("../middlewares/user_profile");

const post_providers_pool = async (req, res) => {
	try {
		const { zipCode } = req.body;

		const profiles = await ProviderProfile.find({ isPublic: true, isDeleted: false, zipCode });

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

const get_providers_in_my_area = async (req, res) => {
	try {
		const profile = req.userProfile;

		if (!profile || !profile.zipCode) {
			res.status(200).json({
				success: true,
				profiles: []
			});
		}

		const profiles = await ProviderProfile.find({ isPublic: true, isDeleted: false, zipCode });

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
		const { name, street, city, state, zipCode, service } = req.body;

		const location = new Location({
			street,
			city,
			state,
			zipCode
		});

		await location.save();

		let profile = new ProviderProfile({
			user: req.user._id,
			name: name,
			location: location._id
		});

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
	app.get("/api/v1/providers/nearby", authenticate, getProfile, get_providers_in_my_area);
	app.post("/api/v1/providers/my/setup", authenticate, post_set_my_provider_profile);
};
