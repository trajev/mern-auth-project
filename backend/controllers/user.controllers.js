
const User = require("../models/user.models")
const joi = require("joi")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.json({ success: true, message: "Users fetched successfully", userCount: users.length, data: users })
  } catch (err) {
    res.json({ success: false, message: "Error occurred at getting all users", error: err.message })
  }
}

const registerUser = async (req, res) => {

  const schema = joi.object({
    name: joi.string().required(),
    email: joi.string().email().required(),
    password: joi.string().min(6).required()
  })

  try {
    const { error } = schema.validate(req.body);

    if (error) {
      return res.status(400).json({ success: false, message: "Error at validating data", error: error.details[0].message })
    }

    const { name, email, password } = req.body;

    const hashPassword = await bcrypt.hash(password, 10);

    const user = await User.create({ name, email, password: hashPassword });
    res.status(201).json({ success: true, message: "user registered successfully", data: user });
  } catch (err) {
    res.status(500).json({ success: false, message: "error occurred at register user", error: err.message })
  }

}


const loginUser = async (req, res) => {


  const schema = joi.object({
    email: joi.string().email().required(),
    password: joi.string().min(6).required()
  })

  try {

    const { error } = schema.validate(req.body);

    if (error) {
      return res.status(400).json({ success: false, message: "Error at validating data", error: error.details[0].message })
    }

    const { email, password } = req.body;

    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(401).json({ success: false, message: "Invalid Credentials, Please try again." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Invalid Credentials, Please try again." })
    }

    const jwttoken = jwt.sign({ email: user.email, id: user._id }, process.env.JWT_SECRET_KEY, { expiresIn: "24h" });

    res.cookie("token", jwttoken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // MS expires in 24 hrs
      sameSite: "strict",
    })

    res.status(201).json({ success: true, message: "user login successfully", data: user, token: jwttoken });
  } catch (err) {
    res.status(500).json({ success: false, message: "error occurred at login user", error: err.message })
  }


}

const getProfile = async (req, res) => {

  try {

    const userId = req.user.id;

    if (!userId) {
      return res.status(400).json({ success: false, message: "User id not found" })
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(400).json({ success: false, message: "User not found" })
    }

    res.status(200).json({ success: true, message: "Profile fetched sucessfully", data: user })

  } catch (err) {
    res.status(500).json({ success: false, message: "Error at getting profile", error: err.message })
  }

}

async function logoutUser(req, res) {
  try {
    res.clearCookie('token');
    res.status(200).json({ success: true, message: "User Logout successfully" })
  } catch (err) {
    res.status(500).json({ success: false, message: "Error at user loggout", error: err.message })
  }
}


module.exports = { getAllUsers, registerUser, loginUser, getProfile, logoutUser }