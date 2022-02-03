const mongoose = require("mongoose");
const shortId = require("shortid");

const UrlSchema = new mongoose.Schema({
  long: {
    type: String,
    required: true,
    trim: true,
  },
  short: {
    type: String,
    required: true,
    // No need to use shortId.generate(), mongoose will
    //  execute the function automatically
    default: shortId.generate,
    trim: true,
  },
  clicks: {
    type: Number,
    required: true,
    default: 0,
  },
});

module.exports = mongoose.model("Url", UrlSchema);
