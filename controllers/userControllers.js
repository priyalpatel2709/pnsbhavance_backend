const asyncHandler = require("express-async-handler");
const generateToken = require("../config/generateToken");
const User = require("../models/userModel");
// const bcrypt = require("bcryptjs");

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, isAdmin, password, phone } = req.body;
  if (!name || !email) {
    res.status(400);
    throw new Error("Pless enter all the Feilds");
  }

  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error("User Already Exists !!!");
  }

  const user = await User.create({
    name,
    email,
    isAdmin,
    password,
    phone,
  });

  if (user) {
    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      password: user.password,
      phone: user.phone,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error("Fail To Create User  :(");
  }
});

const authUser = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });

  res.status(200).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    isAdmin: user.isAdmin,
    phone: user.phone,
    token: generateToken(user._id),
  });
});

const allUsers = asyncHandler(async (req, res) => {
  // console.log('File: userControllers.js', 'Line 61:', req.query.search);
  const keyword = req.query.search
    ? {
        $or: [
          { name: { $regex: req.query.search, $options: "i" } },
          { email: { $regex: req.query.search, $options: "i" } },
        ],
      }
    : {};

  const users = await User.find(keyword).find({ _id: { $ne: req.user._id } });
  res.send(users);
});

const allUsersV2 = asyncHandler(async (req, res) => {
  try {
    // Fetch all projects
    const allProjects = await User.find();

    // Send the projects as a JSON response
    res.json(allProjects);
  } catch (error) {
    // If an error occurs, send an error response
    res.status(500).json({ error: "Internal server error" });
  }
});

const updateUserinfo = asyncHandler(async (req, res) => {
  const { name, isAdmin, password, phone } = req.body;
  const userId = req.params.userId;

  const updatrdUser = await User.findByIdAndUpdate(
    userId,
    {
      phone: phone,
      password: password,
      name: name,
      isAdmin: isAdmin,
    },
    { new: true }
  );

  if (!updatrdUser) {
    res.status(404);
    throw new Error("App Info Not Found");
  } else {
    res.json(updatrdUser);
  }
});

module.exports = {
  registerUser,
  authUser,
  allUsers,
  updateUserinfo,
  allUsersV2,
};
