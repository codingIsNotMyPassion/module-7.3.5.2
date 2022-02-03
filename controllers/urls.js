const Url = require("../models/Url");

/**
 * @desc Get all urls
 * @param {*} req
 * @param {*} res
 */
const getUrls = async (req, res) => {
  const urls = await Url.find();
  res.status(201).json({ urls, length: urls.length, status: "success" });
};

/**
 * @desc Create short url
 * @param {*} req
 * @param {*} res
 */
const shortUrl = async (req, res) => {
  const url = await Url.create(req.body);
  res.status(201).json({ status: "success", url });
};

/**
 * @desc Keep track of url clicks
 * @param {*} req
 * @param {*} res
 */
const urlClicks = async (req, res) => {
  const url = await Url.findOne({ short: req.params.id });
  if (!url) {
    return res.status(404).json({ msg: "Short url does not exist!" });
  }

  url.clicks++;
  url.save();
  res.redirect(url.long);
};

module.exports = { shortUrl, urlClicks, getUrls };
