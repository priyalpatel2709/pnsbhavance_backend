const asyncHandler = require("express-async-handler");
const generateToken = require("../config/generateToken");
const User = require("../models/userModel");
// const bcrypt = require("bcryptjs");

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, isAdmin, password, phone, pic } = req.body;
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
    pic,
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
      pic: user.pic,
    });
  } else {
    res.status(400);
    throw new Error("Fail To Create User  :(");
  }
});

const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
      pic: user.pic,
      isAdmin: user.isAdmin,
      // deviceToken: user.deviceToken,
    });
  } else {
    res.status(400);
    throw new Error("Email or Password is not match");
  }
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

const updateUserinfoAdmin = asyncHandler(async (req, res) => {
  const { name, isAdmin, password, phone, isActive } = req.body;
  const userId = req.params.userId;

  const updatrdUser = await User.findByIdAndUpdate(
    userId,
    {
      phone: phone,
      password: password,
      name: name,
      isAdmin: isAdmin,
      isActive: isActive,
    },
    { new: true }
  );

  if (!updatrdUser) {
    res.status(404);
    throw new Error("User Info Not Found");
  } else {
    res.json(updatrdUser);
  }
});

const updateUserinfo = asyncHandler(async (req, res) => {
  const { name, password, phone, pic } = req.body;
  const userId = req.params.userId;

  // const userExists = await User.findOne({ email });
  // if (userExists) {
  //   res.status(400);
  //   throw new Error("User Already Exists !!!");
  // }

  const updatrdUser = await User.findByIdAndUpdate(
    userId,
    {
      phone: phone,
      password: password,
      name: name,
      pic: pic,
    },
    { new: true }
  );

  if (!updatrdUser) {
    res.status(404);
    throw new Error("User Info Not Found");
  } else {
    res.json(updatrdUser);
  }
});

const deleteUser = asyncHandler(async (req, res) => {
  const userId = req.params.userId;

  // Check if the user is an admin
  if (!req.user.isAdmin) {
    return res
      .status(403)
      .json({ message: "Only admins can perform this action." });
  }

  try {
    // Find the project by its ID and delete it
    const deletedProject = await User.findByIdAndDelete(userId);

    if (!deletedProject) {
      // If the project is not found, return an error
      throw new Error("User not found");
    }

    res.json({ message: "User deleted successfully" });
  } catch (error) {
    // Handle any errors that occur during the delete process
    console.error("Error deleting project:", error);
    res
      .status(500)
      .json({ message: `Error deleting project: ${error.message}` });
  }
});

module.exports = {
  registerUser,
  authUser,
  allUsers,
  updateUserinfoAdmin,
  allUsersV2,
  updateUserinfo,
  deleteUser,
};
