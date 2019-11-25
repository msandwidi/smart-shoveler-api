const sgMail = require("@sendgrid/mail");

const {
  SENDGRID_SECRET,
  NO_REPLY_EMAIL_ADDRESS,
  DEFAULT_EMAIL_SENDER_NAME
} = require("../");

sgMail.setApiKey(SENDGRID_SECRET);

const isTestMode = process.env.NODE_ENV === "test";

class Mailer {
  constructor(header, content) {
    let mailer = this;
    mailer.from = {
      email: NO_REPLY_EMAIL_ADDRESS,
      name: header.sender || DEFAULT_EMAIL_SENDER_NAME
    };
    mailer.to = mailer.formatAddresses(header.recipients);
    mailer.cc = mailer.formatAddresses(header.cc);
    mailer.bcc = mailer.formatAddresses(header.bcc);
    mailer.subject = header.subject;
    mailer.sendAt = header.sendAt;
    mailer.dynamic_template_data = content;
    mailer.templateId = header.templateId;
    mailer.substitutionWrappers = ["{{", "}}"];
    mailer.trackingSettings = {
      clickTracking: {
        enable: true
      },
      openTracking: {
        enable: true
      },
      subscriptionTracking: {
        enable: false
      }
    };
  }

  formatAddresses(recipients) {
    if (typeof recipients === "string") return recipients;
    if (recipients && Array.isArray(recipients))
      return recipients.map(email => email.toString());
    return null;
  }

  send() {
    try {
      let mailer = this;
      if (isTestMode) return Promise.resolve();
      return sgMail.sendMultiple(mailer);
    } catch (error) {
      console.error(error);
      return Promise.resolve();
    }
  }
}

module.exports = Mailer;
