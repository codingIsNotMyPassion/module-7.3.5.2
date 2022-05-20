import express from "express";
import shortid from "shortid";
import validUrl from "valid-url";
import { URL } from "../models/urls.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const availableurls = await URL.find({});
    res.status(200).send(availableurls);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Can't fetch the details" });
  }
});

router.post("/", async (req, res) => {
  try {
    const longUrl = await req.body.longUrl;
    const baseUrl = process.env.baseUrl;
    const valid = validUrl.isUri(longUrl);
    if (!valid) return res.status(400).send("Invalid Url");
    const urlcode = shortid.generate();
    let url = await URL.findOne({ longUrl: longUrl });
    if (url) {
      return res.status(200).send({ data: url.shortUrl });
    } else {
      const shortUrl = baseUrl + urlcode;
      url = await new URL({
        urlcode,
        longUrl,
        shortUrl,
        clicks: 0,
        date: new Date(),
      }).save();

      return res.status(200).send({ data: url.shortUrl });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Internal Server Error" });
  }
});

router.delete("/", async (req, res) => {
  try {
    const Url = await URL.deleteOne({ urlcode: req.body.urlcode });
    if (Url) return res.status(201).send({ message: "Sucessfully deleted" });
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error" });
  }
});

export const shortRouter = router;
