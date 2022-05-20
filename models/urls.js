import mongoose from "mongoose";

const urlSchema = new mongoose.Schema({
  urlcode: { type: String, required: true },
  longUrl: { type: String, required: true },
  shortUrl: { type: String, required: true },
  clicks: { type: Number, required: true, default: 0 },
  date: { type: String, required: true, default: Date.now },
});

const URL = mongoose.model("url", urlSchema);

export { URL };
