import express from "express";
import { User, validate } from "../models/user.js";
import bcrypt from "bcrypt";
import { sendEmail } from "../checkmail/sendEmail.js";
import crypto from "crypto";
import { Token } from "../models/token.js";

const router = express.Router();

//for postman test

router.get("/", async (req, res) => {
  const user = await User.find({});
  res.send(user);
});

router.delete("/", async (req, res) => {
  try {
    const user = await User.deleteOne({ email: req.body.email });
    if (user) return res.send({ message: "sucessfully deleted" });
  } catch (error) {
    res.status(400).send({ message: "internal server error" });
  }
});

//For Client side request

router.post("/", async (req, res) => {
  try {
    //validation
    const { error } = validate(req.body);
    if (error)
      return res.status(400).send({ message: error.details[0].message });

    //find th user is already there
    let user = await User.findOne({ email: req.body.email });
    if (user) return res.status(409).send({ message: "Email already Exist" });

    //generate hashed password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    //updating a new user
    user = await new User({
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
    }).save();

    //email verification
    const token = await new Token({
      userId: user._id,
      token: crypto.randomBytes(32).toString("hex"),
    }).save();

    const url = `${process.env.FRONT_URL}users/${user._id}/verify/${token.token}`;
    await sendEmail(
      user.email,
      "Verify Email",
      `Click the link to verify your account ` + url
    );
    res
      .status(201)
      .send({ message: "An email send to your account please verify" });
  } catch (error) {
    console.log(error);

    res.status(500).send({ message: "Internal Server Error" });
  }
});

//getting the link for verifaction

router.get("/users/:id/verify/:token", async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.params.id });
    if (!user) return res.status(400).send({ message: "Link Expired" });
    const token = await Token.findOne({
      userId: user._id,
      token: req.params.token,
    });
    if (!token) return res.status(400).send({ message: "Link Expired" });
    await User.findOneAndUpdate({ email: user.email},{verified: true });
    await token.remove();
    res.status(200).send({ message: "Verfied Sucessfully!!!" });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Internal Server Error" });
  }
});

//exporting

export const signUpRouter = router;
