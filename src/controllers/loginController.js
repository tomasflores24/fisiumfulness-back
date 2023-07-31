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
require("dotenv").config();
const JWT_secret = process.env.JWT_secret;

// exports.login = async (req, res) => {
//   res.header("Access-Control-Allow-Origin", "*");
//   const { email, password, username } = req.body;

//   if (!username || username.trim() === "") {
//     return res.status(400).json({ error: "Username is required" });
//   }

//   const newUser = new User({
//     username,
//     email,
//     password,
//   });

//   const salt = await bcrypt.genSalt(10);
//   newUser.password = await bcrypt.hashSync(newUser.password, salt);
//   await newUser.save();

//   // Envío del correo electrónico de confirmación
//   const emailConfirmation = async (data) => {
//     const transport = nodemailer.createTransport({
//       host: E_HOST,
//       port: E_PORT,
//       auth: {
//         user: E_USER,
//         pass: E_PASSWORD,
//       },
//     });
//     const { username, email, token } = data;
//     await transport.sendMail({
//       from: "fisiumfulness",
//       to: email,
//       subject: "Confirm account",
//       text: "Confirm account",
//       html: `
//         <p> Hi! ${username}, confirm account in Fisium Fulness </p>
//         <p> Confirm your account in the link :
//         <a href="http://localhost:5173/confirm/${token}"> Confirm Account </a></p>
//         <p> If you didn't create the account, ignore it</p>`,
//     });
//   };

//   emailConfirmation({
//     username: newUser.username,
//     email: newUser.email,
//     token: newUser.token,
//   });

//   res.status(200).send(newUser);
// };

exports.login = async (req, res) => {
  res.header("Access-Control-Allow-Origin", "*")
  const { email, password } = req.body;
  try {
    const user = await User.findOne({email, password});
    if (user) {
      const token = jwt.sign({ userId: user._id, role: user.role }, JWT_secret, { expiresIn: '1h' });
      return res.status(200).json({user, token});
    } else {
      return res.status(401).json({ message: 'Usuario no encontrado' });
    }
  } catch (error) {
    return res.status(400).send(error.message);
  }
}

exports.recoverAccount = async (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return res.send("Invalid email");
  }

  const newPassword = Math.random().toString(32).substring(2);
  const salt = await bcrypt.genSalt(10);
  const passCrypt = await bcrypt.hash(newPassword, salt);
  user.password = passCrypt;

  await user.save();

  // Envío del correo electrónico de recuperación de cuenta
  const emailRecovery = async (data) => {
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
      subject: "Account Recovery - Fisium Fulness",
      text: "Account Recovery - Fisium Fulness",
      html: `
        <p> Hi! ${username}, Reset your password on Fisium Fulness</p>
        <p> This is your new password: ${password}</p>
        <p> Click on the link to log in:
        <a href="http://localhost:5173/login"> Fisium Fulness</a></p>
        <p> If you did not request the change, ignore this message.</p>`,
    });
  };

  emailRecovery({
    username: user.username,
    email: user.email,
    password: newPassword,
  });

  res.send("Account recovery email sent");
};

