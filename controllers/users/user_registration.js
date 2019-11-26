const User = require("../../models/User");

//middlewares

const emailService = require("../../services/email");
const emailTypes = require("../../services/email/emailTypes");

/**
 * signup
 * @param {*} req
 * @param {*} res
 */
const post_signup = async (req, res) => {
	try {
		const { name, email, password } = req.body;

		const existingUser = await User.findOne({
			email
		});

		if (!existingUser) {
			const newUser = new User({
				name,
				email,
				password,
				isVerified: true
			});

			const token = await newUser.generateToken("activation");

			const emailBody = {
				_id: newUser._id,
				email,
				name,
				token,
				type: emailTypes.CONFIRM_SIGNUP
			};
			if (token) emailService.sendEmail(emailBody);
		}

		return res.status(200).json({
			success: true,
			message:
				"A confirmation email was sent to you"
		});
	} catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "An error occured while processing your request"
    });
	}
};

/**
 * activate new account
 * @param {*} req
 * @param {*} res
 */
const get_activate_account = async (req, res) => {
	try {
		const id = req.params.id;

		const user = await User.findByToken("activation", id);

		if (!user) {
			return res.status(400).json({
				success: false,
				message: "This link seems to be expired"
			});
		}

		user.activateAccount();

		const emailBody = {
			_id: user._id,
			name: user.name,
			email: user.email,
			type: emailTypes.CONFIRM_ACTIVATION
		};

		emailService.sendEmail(emailBody);

		return res.status(200).json({
			success: true,
			message: "Your account is activiated"
		});
	} catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "An error occured while processing your request"
    });
	}
};

module.exports = (app) => {
	app.post(`/api/v1/users/account/signup`,   post_signup);
	app.get(
		`/api/v1/users/account/signup/activate/:id`,
		get_activate_account
	);
};
