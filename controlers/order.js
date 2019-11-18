const Order = require("../models/Order");
const utils = require("../utils");

const get_ping = (req, res) => {
	res.status(200).json({
		success: true,
		text: "Up and Running..."
	});
};

const get_landing = (req, res) => {
	res.status(200).json({
		text: "Smart Shoveler API home...",
		success: true
	});
};

/**
 * user post a work request
 * @param {*} req 
 * @param {*} res 
 */
const post_add_order = async (req, res) => {
	const { email, description, date, type, isRecurrent } = req.body;

	let order = new Order({
		email,
		description,
		type,
		date,
		isRecurrent,
		confirmation: utils.generateRandomToken("number", 6)
	});

	order = await order.save();

	res.status(200).json({
		success: true,
		order
	});
};

/**
 * find and update an order
 * @param {*} req 
 * @param {*} res 
 */
const put_update_order = async (req, res) => {
	const { email, description, date, type, isRecurrent } = req.body;

	const number = req.params.id;

	let order = await Order.findOne({
		number
	});

	if (!order) {
		res.status(404).json({
			success: false,
			message: "We could not find your order"
		});
	}

	order.email = email;
	order.description = description;
	order.data = date;
	order.isRecurrent = isRecurrent;
	order.type = type;

	order = await order.save();

	res.status(200).json({
		success: true,
		order
	});
};

/**
 * search an order
 * @param {*} req 
 * @param {*} res 
 */
const post_search_order = async (req, res) => {
	const { email, orderNumber: number } = req.body;

	let order = await Order.findOne({
		number,
		email
	});

	if (!order) {
		res.status(404).json({
			success: false,
			message: "We could not find your order"
		});
	}

	res.status(200).json({
		success: true,
		order
	});
};

module.exports = (app) => {
	app.get("/api/v1/orders", get_landing);
	app.post("/api/v1/orders", post_add_order);
	app.put("/api/v1/orders/:id", put_update_order);
	app.post("/api/v1/orders/search", post_search_order);
};
