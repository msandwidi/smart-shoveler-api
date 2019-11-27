/**
 * email sender service
 */

const Notification = require("../../models/Notification");
const moment = require("moment");
const NotificationTypes = require("../../config/notification/types");

//sendgird
const Mailer = require("../../config/sendgrid/Mailer");
const templateTypes = require("../../config/sendgrid/_templateTypes");
const emailTemplates = require("../../config/sendgrid/_emailTemplates");
const utils = require("../../utils");

/**
 * send email
 * @param {*} req
 * @param {*} res
 */
module.exports.sendEmail = async data => {
  try {
    const { type, email } = data;
    if (email) {
      switch (type) {
        case templateTypes.CONFIRM_SIGNUP:
          sendSignupConfirmation(data);
          break;
        case templateTypes.CONFIRM_ACTIVATION:
          sendActivationConfirmation(data);
          break;
        case templateTypes.RECOVERY_LINK:
          sendRecoveryLink(data);
          break;
        case templateTypes.CONFIRM_RECOVERY:
          sendRecoveryConfirmation(data);
          break;
        case templateTypes.WELCOME_MESSAGE:
          sendWelcomeEmail(data);
          break;
        case templateTypes.CONFIRM_PROFILE_UPDATE:
          sendProfileUpdateConfirmation(data);
          break;
         default: {
          const message =
            "Could not find email of type" +
            type +
            ". Des= " +
            data.email +
            " at " +
            Date.now();
          console.log(message);
        }
      }
    }
    console.log(type, data.email, moment().format("MM-DD-YYYY h:mm:ss A"));
  } catch (error) {
    console.log(error);
  }
};

/**
 * send signup confirmation email
 * @param {*} param0
 */
const sendSignupConfirmation = async ({ name, email }) => {
  const emailHeader = {
    recipients: email,
    templateId: emailTemplates.CONFIRM_SIGNUP
  };

  const emailBody = {
    name
  };

  send(emailHeader, emailBody);
};

/**
 * send recoverylink to user
 * @param {*} param0
 */
const sendRecoveryLink = async ({ email, token }) => {
  const emailHeader = {
    recipients: email,
    templateId: emailTemplates.RECOVERY_LINK
  };

  const emailBody = {
    token,
    email
  };

  send(emailHeader, emailBody);
};

/**
 * send activiation confirmation to user
 * @param {*} param0
 */
const sendActivationConfirmation = async ({
  name,
  email,
  _id: userId
}) => {
  const emailHeader = {
    recipients: email,
    templateId: emailTemplates.CONFIRM_ACTIVATION
  };

  const emailBody = {
    name,
    email
  };

  send(emailHeader, emailBody)
    .then(() => {
      addNotificationFor(
        userId,
        NotificationTypes.SUCCESS,
        "Votre compte est activé"
      );
    })
    .catch(error => {
      console.error(error.toString());

      //Extract error msg
      //const {message, code, response} = error;
      //const {headers, body} = response;
    });
};

/**
 * send profile udpate confirmation
 * @param {*} param0
 */
const sendProfileUpdateConfirmation = async ({
  name,
  email,
  _id: userId
}) => {
  const emailHeader = {
    recipients: email,
    templateId: emailTemplates.CONFIRM_PROFILE_UPDATE
  };

  const emailBody = {
    name,
  };

  send(emailHeader, emailBody)
    .then(() => {
      addNotificationFor(
        userId,
        NotificationTypes.SUCCESS,
        "Votre profile a été mis à jour"
      );
    })
    .catch(error => {
      console.error(error.toString());
    });
};

/**
 * send recovery confirmation
 * @param {*} param0
 */
const sendRecoveryConfirmation = async ({ name, email, _id: userId }) => {
  const emailHeader = {
    recipients: email,
    templateId: emailTemplates.CONFIRM_RECOVERY
  };

  const emailBody = {
    token,
    name
  };

  send(emailHeader, emailBody)
    .then(() => {
      addNotificationFor(
        userId,
        NotificationTypes.SUCCESS,
        "Votre compte é été reinitialisé"
      );
    })
    .catch(error => {
      console.error(error.toString());
    });
};

/**
 * send user welcome email
 * @param {*} param0
 */
const sendWelcomeEmail = async ({ name, email }) => {
  const emailHeader = {
    recipients: email,
    templateId: emailTemplates.WELCOME_MESSAGE
  };

  const emailBody = {
    name
  };

  send(emailHeader, emailBody);
};

/**
 * send request to sendgrid
 * @param {*} header
 * @param {*} body
 */
const send = async (header, body) => {
  const mailer = new Mailer(header, body);
  return mailer.send();
};

/**
 * add a notification for user
 * @param {*} userId
 * @param {*} type
 * @param {*} content
 */
const addNotificationFor = async (userId, type, content) => {
  const notification = new Notification({
    userId,
    type,
    content
  });
  notification.save();
};
