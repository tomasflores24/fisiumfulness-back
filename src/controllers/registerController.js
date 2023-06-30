const User = require("../models/User");
const { check, validationResult } = require("express-validator");
require("dotenv").config();
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const E_HOST = process.env.MAILHOST;
const E_PORT = process.env.MAILPORT;
const E_USER = process.env.MAILUSER;
const E_PASSWORD = process.env.MAILPASSWORD;

exports.register = async (req, res) => {
  const { username, password, email, lastname, firstname ,phone} = req.body;
  res.header("Access-Control-Allow-Origin", "*");
  await check("username").notEmpty().withMessage("Is required").run(req);
  await check("email").isEmail().withMessage("example@example.com").run(req);
  await check("password")
    .isLength({ min: 6 })
    .withMessage("Min 6 character")
    .run(req);

  let result = validationResult(req);
  //verification length
  if (!result.isEmpty()) {
    return res.json(result.array());
  }

  const existsUser = await User.findOne({ email: req.body.email });
  if (existsUser) {
    console.log("User already exists");
    return;
  }

  const generarId =
    Math.random().toString(32).substring(2) + Date.now().toString(32);
  const user = new User({
    username,
    password,
    lastname,
    firstname,
    email,
    phone,
    token: generarId,
  });

  const salt = await bcrypt.genSaltSync(10);
  user.password = await bcrypt.hashSync(user.password, salt);
  await user.save();

  const emailRegister = async (data) => {
    const transport = nodemailer.createTransport({
      host: E_HOST,
      port: E_PORT,
      auth: {
        user: E_USER,
        pass: E_PASSWORD,
      },
    });
    const { username, email, token } = data;
    await transport.sendMail({
      from: "fisiumfulness",
      to: email,
      subject: "Confirm account",
      text: "Confirm account",
      html: `
      <p> Hi! ${username}, confirm acount in Fisium Fulness </p>
      <p> Confirm your account in the link :
      <a href="http://localhost:3001/local/confirm/${token}"> Confirm Account </a></p>
      <p> If you don't create the account, ignore</p>`,
    });
  };
  emailRegister({
    username: user.username,
    email: user.email,
    token: user.token,
  });
  res.status(200).send(user);
};

exports.confirm = async (req, res) => {
  const { token } = req.params;
  res.header("Access-Control-Allow-Origin", "*");
  const user = await User.findOne({ token });
  if (!user) {
    res.send("Invalid Token");
  }
  user.token = null;
  user.confirm = true;
  await user.save();
  res.redirect("http://localhost:3001/login");
};

exports.recoverPassword = async (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  await check("email").isEmail().withMessage("example@example.com").run(req);
  let result = validationResult(req);
  if (!result.isEmpty()) {
    return res.json(result.array());
  }
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return res.send("Invalid email");
  }

  const newPassword = Math.random().toString(32).substring(2);
  const salt = await bcrypt.genSaltSync(10);
  const passCrypt = await bcrypt.hashSync(newPassword, salt);
  user.password = passCrypt;

  await user.save();
  //send email
  const emailRecover = async (data) => {
    const transport = nodemailer.createTransport({
      host: E_HOST,
      port: E_PORT,
      auth: {
        user: E_USER,
        pass: E_PASSWORD,
      },
    });

    const { username, email, password } = data;
    await transport.sendMail({
      from: "fisiumfulness",
      to: email,
      subject: "Reset your password on Fisium Fulness",
      text: "Reset your password on Fisium Fulness",
      html: `
        <p> Hi! ${username}, Reset your password on Fisium Fulness</p>
        <p> this is your new password " ${password} "</p>
        <p> click on the link to log in:
        <a href="http://localhost:3001/login"> Fisium Fulness</a></p>
        <p> If you did not request the change ignore the message </p>`,
    });
  };

  emailRecover({
    username: user.username,
    email: user.email,
    password: newPassword,
  });
  res.send("ok");
};

exports.loginLocal = async (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  const { username, password } = req.body;
  const user = await User.findOne({ username: username });

  if (user) {
    const validPassword = await bcrypt.compareSync(password, user.password);
    if (validPassword && user.confirm) {
      const token = jwt.sign(
        {
          id: user.id,
          username: user.username,
          role: user.role,
          email: user.email,
        },
        "top_secret",
        {
          expiresIn: 60 * 60 * 24,
        }
      );
      res
        .cookie("jwt", token, {
          expires: new Date(Date.now() + 5000),
          httpOnly: true,
        })
        .send(token);
    } else {
      res.send("Incorrect password");
    }
  } else {
    res.send("Incorrect data");
  }
};
