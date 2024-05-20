const router = require("express").Router();
const User = require("../models/User");
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: 'Gmail', // Use your email service
  auth: {
    user: 'cosmosshopweb@gmail.com', // Your email
    pass: 'Cosmos123shop', // Your email password
  },
});

const sendConfirmationEmail = (email, username) => {
  const mailOptions = {
    from: 'cosmosshopweb@gmail.com',
    to: email,
    subject: 'Account Created Successfully',
    text: `Hello ${username},\n\nYour account has been created successfully!\n\nBest regards,\nCOSMOS SHOP`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email:', error);
    } else {
      console.log('Email sent:', info.response);
    }
  });
};

//REGISTER
router.post("/register", async (req, res) => {
  const newUser = new User({
    username: req.body.username,
    email: req.body.email,
    password: CryptoJS.AES.encrypt(
      req.body.password,
      process.env.PASS_SEC
    ).toString(),
  });

  try {
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
    sendConfirmationEmail(savedUser.email, savedUser.username);
  } catch (err) {
    console.error("Error during user registration:", err);  // Log the error details
    res.status(500).json({ message: "Internal Server Error", error: err });
  }
});

//LOGIN

router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username });
    if (!user) return res.status(401).json("Wrong credentials!");

    const hashedPassword = CryptoJS.AES.decrypt(user.password, process.env.PASS_SEC);
    const OriginalPassword = hashedPassword.toString(CryptoJS.enc.Utf8);

    if (OriginalPassword !== req.body.password) {
      return res.status(401).json("Wrong credentials!");
    }

    const accessToken = jwt.sign(
      {
        id: user._id,
        isAdmin: user.isAdmin,
      },
      process.env.JWT_SEC,
      { expiresIn: "3d" }
    );

    const { password, ...others } = user._doc;
    res.status(200).json({ ...others, accessToken });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post("/logout", (req, res) => {
  // For logout, you can clear the token from the client side
  // and on the server side, you can invalidate the token if you have token blacklisting

  // To demonstrate, we'll just send a success message
  res.status(200).json("Logged out successfully");
});

module.exports = router;

module.exports = router;