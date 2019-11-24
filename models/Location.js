const mongoose = require("mongoose");
const timestamps = require("mongoose-timestamp");
const Schema = mongoose.Schema;

const LocationSchema = new Schema({
  street: {
    type: String,
    trim: true
  },

  city: {
    type: String,
    trim: true
  },

  county: {
    type: String,
    trim: true
  },

  state: {
    type: String,
    trim: true
  },

  country: {
    type: String,
    trim: true
  },

  zipCode: Number,

  latitude: Number,

  longitude: Number,

  isDeleted: {
    type: Boolean,
    default: false
  }
});

LocationSchema.plugin(timestamps);

module.exports = mongoose.model("Location", LocationSchema);
