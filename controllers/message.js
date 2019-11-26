const UserMessage = require("../models/Message");

const authenticate = require("../middlewares/user_auth");

const get_my_messages = async (req, res) => {
  const messages = await UserMessage.findMyMessages(req.user._id);

  res.status(200).json({
    success: true,
    messages
  });
};

module.exports = app => {
  app.get("/api/v1/messages", authenticate, get_my_messages);
};
