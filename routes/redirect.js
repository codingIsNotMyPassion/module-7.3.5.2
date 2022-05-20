import express from "express";
import { URL } from "../models/urls.js";

const router = express.Router();

router.get("/:short", async (req, res) => {
  try {
    const short = req.params.short;
    const url = await URL.findOne({ urlcode: short });
    if (!url) return res.status(400).send({ message: "Invalid Url" });
    let click = await url.clicks;
    click++;

    await url.updateOne({ shortUrl: url.shortUrl, clicks: click });
    return res.redirect(url.longUrl);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Internal Server Error" });
  }  
});

export const redirectRouter = router;
