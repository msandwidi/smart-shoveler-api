const User = require("../../models/User");

//middlewares
const requireJWTHeaderToken = require("../../middlewares/user_auth");
const checkValidationErrors = require("../../middlewares/check_validation_errors");

const emailService = require("../../services/email");

const emailTypes = require("../../services/email/emailTypes");

const validations = require("../../validations");

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
      message: "A recovery link was sent to your email"
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
const get_verify_reset_token = async (req, res) => {
  try {
    const id = req.params.id;

    const user = await User.findByToken("reset", id);

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "This link seems to be expired"
      });
    }

    await user.generateToken("new_pwd");

    return res.status(200).json({
      success: true,
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
    const password = req.body.password;

    const resetToken = req.token;

    const user = await User.findByToken("new_pwd", resetToken);

    if (!user) {
      return res.status(403).json({
        success: false,
        message:
          "Session expired"
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

module.exports = app => {
  app.get(
    `/api/v1/users/recovery/:id`,
    validations.USER_VERIFY_TOKEN,
    checkValidationErrors,
    get_verify_reset_token
  );

  app.post(
    `/api/v1/users/recovery`,
    validations.USER_RECOVERY,
    checkValidationErrors,
    post_account_recovery
  );

  app.put(
    `/api/v1/users/recovery`,
    requireJWTHeaderToken,
    validations.USER_RESET_NEW_PWD,
    checkValidationErrors,
    put_new_password
  );
};
