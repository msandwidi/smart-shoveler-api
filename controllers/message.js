const UserMessage = require("../models/Message");

const authenticate = require("../middlewares/user_auth");

const get_my_messages = async (req, res) => {
  const messages = await UserMessage.findMyMessages(req.user._id);

  res.status(200).json({
    success: true,
    messages
  });
};

const post_new_message = async (req, res) => {
  const user = req.user._id;
  const { recipientId, content } = req.body;
  const message = UserMessage({
    recipientId,
    senderId: user,
    content
  });

  res.status(200).json({
    success: true,
    message
  });
};

module.exports = app => {
  app.get("/api/v1/messages", authenticate, get_my_messages);
  app.post("/api/v1/messages", authenticate, post_new_message);
};
