const Order = require("../models/Order");
const utils = require("../utils")

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

module.exports = (app) => {
	app.get("/api/v1/orders", get_landing);
	app.post("/api/v1/orders", post_add_order);
};
