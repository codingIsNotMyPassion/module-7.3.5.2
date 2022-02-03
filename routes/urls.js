const express = require("express");
const router = express.Router();

const { shortUrl, urlClicks, getUrls } = require("../controllers/urls");

router.post("/url", shortUrl);
router.get("/url/:id", urlClicks);
router.get("/url", getUrls);

module.exports = router;
