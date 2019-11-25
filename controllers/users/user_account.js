const User = require("../../models/User");

//middlewares
const authenticate = require("../../middlewares/user_auth");
const checkValidationErrors = require("../../middlewares/check_validation_errors");

const emailService = require("../../services/email");

const emailTypes = require("../../services/email/emailTypes");

/**
 * get user from token
 * @param {*} req
 * @param {*} res
 */
const get_user_from_token = async (req, res) => {
  try {
    const user = await User.findByToken("auth", req.token);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Unable to authenticate your request"
      });
    }

    return res.json({
      success: true,
      token: req.token,
      user: user.toAuthProfile()
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
 * logout user
 * @param {*} req
 * @param {*} res
 */
const delete_token = async (req, res) => {
  try {
    await req.user.removeToken(req.token);
    return res.status(200).json({
      success: true,
      message: "Disconnected"
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "An error occured while processing your request"
    });
  }
};

const get_my_profile = async (req, res) => {
  return res.status(200).json({
    success: true,
    profile: req.user.toMyProfile()
  });
};

/**
 * login preflight
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
const login_fetch_account = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findByCredentials(email, password);
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Username/Password incorrect"
      });
    }

    req.user = user;
    return next();
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "An error occured while processing your request"
    });
  }
};

/**
 * handle login
 * @param {*} req
 * @param {*} res
 */
const post_login = async (req, res) => {
  try {
    if (!req.user.isVerified) {
      return res.status(403).json({
        success: false,
        message: "Your account is not activated yet"
      });
    }

    if (req.user.isBlocked) {
      return res.status(403).json({
        success: false,
        message:
          "Your account is currently blocked"
      });
    }

    const token = await req.user.generateToken("auth");

    if (!token) {
      console.log(error);
      return res.status(500).json({
        success: false,
        message: "An error occured while processing your request"
      });
    }

    return res.status(200).json({
      success: true,
      token,
      user: req.user.toAuthProfile()
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
 * update profile
 * @param {*} req
 * @param {*} res
 */
const put_update_profile = async (req, res) => {
  try {
    const { password, email } = req.body;

    req.user.comparePassword(password, async (err, isMatch) => {
      if (err) {
        console.log(error);
        return res.status(500).json({
          success: false,
          message: "An error occured while processing your request"
        });
      }

      if (!isMatch) {
        return res.status(400).json({
          success: false,
          message: "The confirmation password is not correct"
        });
      }

      const existingUser = await User.findOne({
        email
      });

      if (
        !existingUser ||
        existingUser._id.toHexString() === req.user._id.toHexString()
      ) {
        req.user = await req.user.updateProfile(req.body);

        const emailBody = {
          _id: req.user._id,
          name: req.user.name,
          email: req.user.email,
          type: emailTypes.CONFIRM_PROFILE_UPDATE
        };

        emailService.sendEmail(emailBody);

        return res.status(200).json({
          success: true,
          user: req.user.toAuthProfile(),
          message: "Profile updated"
        });
      }

      return res.status(401).json({
        success: false,
        message: "Email address unavailable"
      });
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
 * change password
 * @param {*} req
 * @param {*} res
 */
const put_change_password = async (req, res) => {
  try {
    const { password, currentPassword } = req.body;

    req.user.comparePassword(currentPassword, async (err, isMatch) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message:
            "Unable to verify your request"
        });
      }

      if (!isMatch) {
        return res.status(400).json({
          success: false,
          message: "Confirmation password incorrect"
        });
      }

      req.user.updatePassword(password);

      const emailBody = {
        _id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        type: emailTypes.CONFIRM_PASSWORD_CHANGE
      };

      emailService.sendEmail(emailBody);

      return res.status(200).json({
        success: true,
        message: "Password changed"
      });
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
  app.get(`/api/v1/users/account/auth`, authenticate, get_user_from_token);
  app.get(`/api/v1/users/account/profile`, authenticate, get_my_profile);

  app.put(
    `/api/v1/users/account/profile`,
    authenticate,
    checkValidationErrors,
    put_update_profile
  );
  app.put(
    `/api/v1/users/account/password`,
    authenticate,
    checkValidationErrors,
    put_change_password
  );
  app.post(
    `/api/v1/users/account/login`,
    checkValidationErrors,
    login_fetch_account,
    post_login
  );
  app.post(`/api/v1/users/account/logout`, authenticate, delete_token);
};
