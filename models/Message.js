const mongoose = require("mongoose");
const timestamps = require("mongoose-timestamp");
const Schema = mongoose.Schema;

const MessageSchema = new Schema({
  content: {
    type: String,
    trim: true
  },

  title: {
    type: String,
    trim: true
  },

  recipientId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  senderId: {
    type: Schema.Types.ObjectId,
    ref: "User"
  },

  thread: [
    {
      content: String,
      userId: Schema.Types.ObjectId,
      date: {
        type: Date,
        default: Date.now()
      }
    }
  ],

  isDeleted: {
    type: Boolean,
    default: false
  },

  isClosed: {
    type: Boolean,
    default: false
  }
});

MessageSchema.plugin(timestamps);

MessageSchema.statics.findMyMessages = function(user) {
  return this.find({
    $or: [
      {
        senderId: user
      },
      {
        recipientId: user
      }
    ],
    isDeleted: false
  });
};

module.exports = mongoose.model("Message", MessageSchema);
