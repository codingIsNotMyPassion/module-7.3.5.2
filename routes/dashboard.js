import express from "express";
import jwt from "jsonwebtoken";
import { User } from "../models/user.js";
import shortid from "shortid";
import validUrl from "valid-url";
import { URL } from "../models/urls.js";

const router = express.Router();
router.get("/", async (req, res) => {
  const token = req.headers["x-auth-token"];
  try {
      //verifying Jwt
    const decode = jwt.verify(token, process.env.secretkey);

    const user = await User.findOne({ email: decode.email });
  
    if (!user) return res.status(400).send({ message: "Inavlid User Access" });

    const specific = user.data.map((event) => event.refID);

    const urls = await URL.find({ _id: { $in: specific } });

    res.status(200).send({ message: user.username, data: urls });
  } catch (error) {
    console.log(error);
    res.status(500).send({ data: "Invalid Access" });
  }
});

router.post("/", async (req, res) => {
  const token = req.headers["x-auth-token"];
  try {
    const decode = jwt.verify(token, process.env.secretkey);
    const user = await User.findOne({ email: decode.email });

    if (!user) {
      return res.status(400).send({ message: "Invalid Authorization" });
    }
    const longUrl = await req.body.longUrl;
    const baseUrl = process.env.baseUrl;
    const valid = validUrl.isUri(longUrl);
    if (!valid) return res.status(400).send({ message: "Invalid Url" });
    const urlcode = shortid.generate();
    let url = await URL.findOne({ longUrl: longUrl });
    if (url) {
      return res.status(200).send({ message: url.shortUrl });
    } else {
      const shortUrl = baseUrl + urlcode;
      url = await new URL({
        urlcode,
        longUrl,
        shortUrl,
        clicks: 0,
        date: new Date(),
      }).save();
    }

    await User.findOneAndUpdate(
      { email: decode.email },
      { $addToSet: { data: { refID: url._id } } }
    );

    return res.status(200).send({ message: url.shortUrl });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Internal Server Error" });
  }
});

router.delete("/", async (req, res) => {
  try {
    const Url = await URL.deleteOne({ urlcode: req.body.urlcode });
    if (!Url) return res.status(200).send({ message: "Not Deleted" });
    res.status(200).send({ message: "Succesfully deleted" });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Internal server Error" });
  }
});

export const dashRouter = router;
