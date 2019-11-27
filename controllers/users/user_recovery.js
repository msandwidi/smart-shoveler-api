const User = require("../../models/User");

//middlewares
const validations = require("../../validations/");
const checkValidationErrors = require("../../middlewares/check_validation_errors");

const emailService = require("../../services/email");

const emailTypes = require("../../services/email/emailTypes");

/**
 * start recovery
 * @param {*} req
 * @param {*} res
 */
const post_account_recovery = async (req, res) => {
	try {
		const email = req.body.email;

		const user = await User.findOne({
			email,
			isVerified: true,
			isClosed: false
		});

		if (user) {
			const token = await user.generateToken("reset");

			const emailBody = {
				token,
				email: user.email,
				type: emailTypes.RECOVERY_LINK
			};

			emailService.sendEmail(emailBody);
		}

		return res.status(200).json({
			success: true,
			message: "A recovery code was sent to your email"
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
 * verify reset token
 * @param {*} req
 * @param {*} res
 */
const post_verify_reset_code = async (req, res) => {
	try {
		const { code } = req.body;

		const user = await User.findByToken("reset", code);

		if (!user) {
			return res.status(400).json({
				success: false,
				message: "This link seems to be expired"
			});
		}

		const token = await user.generateToken("new_pwd");

		return res.status(200).json({
      success: true,
      token,
			message: "Enter your new password to continue"
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
 * reset password
 * @param {*} req
 * @param {*} res
 */
const put_new_password = async (req, res) => {
	try {
		const {password, token} = req.body;

		const user = await User.findByToken("new_pwd", token);

		if (!user) {
			return res.status(403).json({
				success: false,
				message: "Session expired"
			});
		}
		user.updatePassword(password);

		const emailBody = {
			name: user.name,
			email: user.email,
			type: emailTypes.CONFIRM_RECOVERY
		};

		emailService.sendEmail(emailBody);

		return res.status(200).json({
			success: true,
			message: "Password updated"
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
	app.post(`/api/v1/users/account/recovery/verify`, post_verify_reset_code);

	app.post(`/api/v1/users/account/recovery`, validations.USER_RECOVERY, checkValidationErrors, post_account_recovery);

	app.put(`/api/v1/users/account/recovery`, validations.USER_RESET_NEW_PWD, checkValidationErrors, put_new_password);
};
