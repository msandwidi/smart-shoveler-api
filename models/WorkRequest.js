const mongoose = require("mongoose");
const timestamps = require("mongoose-timestamp");
const Schema = mongoose.Schema;

const WorkRequestSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User"
  },

  jobType: {
    type: String,
    trim: true,
    required: true,
    default: "snow"
  },

  price: {
    type: String,
    trim: true,
    required: true
  },

  details: {
    type: String,
    trim: true
  },

  isHome: {
    type: Boolean,
    default: true
  },

  hasDriveway: {
    type: Boolean,
    default: true
  },

  hasSidewalk: {
    type: Boolean,
    default: false
  },

  date: {
    type: Date,
    default: Date.now()
  },

  address: {
    type: String,
    trim: true,
    required: true
  },

  addressStreet: {
    type: String,
    trim: true
  },

  addressCity: {
    type: String,
    trim: true
  },

  addressState: {
    type: String,
    trim: true
  },

  addressZip: {
    type: String,
    trim: true,
    required: true
  },

  isFulFilled: {
    type: Boolean,
    default: false
  },

  isCancel: {
    type: Boolean,
    default: false
  },

  isDeleted: {
    type: Boolean,
    default: false
  },
  isNoAuth: {
    type: Boolean,
    default: false
  }
});

WorkRequestSchema.plugin(timestamps);

module.exports = mongoose.model("WorkRequest", WorkRequestSchema);
