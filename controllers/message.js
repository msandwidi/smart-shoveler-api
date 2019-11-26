const UserMessage = require("../models/Message");

const authenticate = require("../middlewares/user_auth");

const get_my_messages = async (req, res) => {
  try {
    const messages = await UserMessage.findMyMessages(req.user._id);

    console.log(messages);

    res.status(200).json({
      success: true,
      messages
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "An error occured"
    });
  }
};

const get_my_message_details = async (req, res) => {
  try {
    const message = await UserMessage.findMyOneMessage(
      req.user._id,
      req.params.id
    );

    if (!message) {
      res.status(404).json({
        success: false,
        message: "The selected message cannot be found"
      });
    }

    console.log(message);

    res.status(200).json({
      success: true,
      message
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "An error occured"
    });
  }
};

const post_new_message = async (req, res) => {
  try {
    const user = req.user._id;
    const { recipientId, content } = req.body;
    let message = UserMessage({
      recipientId,
      senderId: user,
      senderName: req.user.name,
      content
    });

    message = await message.save();

    res.status(200).json({
      success: true,
      message
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "An error occured"
    });
  }
};

module.exports = app => {
  app.get("/api/v1/messages", authenticate, get_my_messages);
  app.post("/api/v1/messages", authenticate, post_new_message);
  app.get("/api/v1/messages/:id", authenticate, get_my_message_details);
};
