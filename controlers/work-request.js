const WorkRequest = require("../models/WorkRequest");
const utils = require("../utils");

const authenticate = require("../middlewares/user_auth");

/**
 * user post a work request
 * @param {*} req
 * @param {*} res
 */
const post_add_request = async (req, res) => {
	try {
		console.log(req.body);
		const { details, date, type, isRecurrent, isHome, hasDriveway, hasSidewalk, address, price } = req.body;

		let request = new WorkRequest({
			price,
			details,
			address,
			type,
			date,
			isRecurrent,
			isHome,
			hasDriveway,
			hasSidewalk,
			user: req.user._id
		});

		request = await request.save();

		res.status(200).json({
			success: true,
			request
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({
			success: false,
			message: "An unknown error occured"
		});
	}
};

/**
 * find and update an request
 * @param {*} req
 * @param {*} res
 */
const put_update_request = async (req, res) => {
	try {
		const { email, description, date, type, isRecurrent } = req.body;

		const number = req.params.id;

		let request = await WorkRequest.findOne({
			number
		});

		if (!request) {
			res.status(404).json({
				success: false,
				message: "We could not find your request"
			});
		}

		request.email = email;
		request.description = description;
		request.data = date;
		request.isRecurrent = isRecurrent;
		request.type = type;

		request = await request.save();

		res.status(200).json({
			success: true,
			request
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({
			success: false,
			message: "An unknown error occured"
		});
	}
};

/**
 * get current active works
 * @param {*} req
 * @param {*} res
 */
const get_my_requests = async (req, res) => {
	try {
		const requests = await WorkRequest.find({
			isDeleted: false,
			user: req.user._id
		});
		console.log(requests);
		res.status(200).json({
			success: true,
			requests
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({
			success: false,
			message: "An unknown error occured"
		});
	}
};

const post_requests_pool = async (req, res) => {
	try {
    const { zipCode } = req.body;
    
		const requests = await WorkRequest.find({
			isDeleted: false
    });
    
		res.status(200).json({
			success: true,
			requests
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({
			success: false,
			message: "An unknown error occured"
		});
	}
};

/**
 * search an request
 * @param {*} req
 * @param {*} res
 */
const post_search_request = async (req, res) => {
	try {
		const { email, requestNumber: number } = req.body;

		let request = await WorkRequest.findOne({
			number,
			email
		});

		if (!request) {
			res.status(404).json({
				success: false,
				message: "We could not find your request"
			});
		}

		res.status(200).json({
			success: true,
			request
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({
			success: false,
			message: "An unknown error occured"
		});
	}
};

module.exports = (app) => {
	app.post("/api/v1/requests/pool", post_requests_pool);
	app.get("/api/v1/requests", authenticate, get_my_requests);
	app.post("/api/v1/requests", authenticate, post_add_request);
	app.put("/api/v1/requests/:id", authenticate, put_update_request);
	app.post("/api/v1/requests/search", authenticate, post_search_request);
};
