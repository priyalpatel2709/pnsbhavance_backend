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
      isActive: user.isActive,
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
      isActive: user.isActive,
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
    const allUsers = await User.find().populate("favorites", "projectname");

    // Send the projects as a JSON response
    res.json(allUsers);
  } catch (error) {
    // If an error occurs, send an error response
    res.status(500).json({ error: "Internal server error" });
  }
});

const updateUserinfoAdmin = asyncHandler(async (req, res) => {
  const { name, isAdmin, password, phone, isActive, pic } = req.body;
  const userId = req.params.userId;

  const updatrdUser = await User.findByIdAndUpdate(
    userId,
    {
      phone: phone,
      password: password,
      name: name,
      isAdmin: isAdmin,
      isActive: isActive,
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

const updateUserinfo = asyncHandler(async (req, res) => {
  const { name, password, phone, pic } = req.body;
  const userId = req.params.userId;

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
    // console.error("Error deleting project:", error);
    res
      .status(500)
      .json({ message: `Error deleting project: ${error.message}` });
  }
});

const getOneuser = asyncHandler(async (req, res) => {
  const userId = req.params.userId;

  const user = await User.findById(userId);

  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    res.json(user);
  } catch (error) {
    // Handle any errors that occur during the delete process
    // console.error("Error deleting project:", error);
    res
      .status(500)
      .json({ message: `Error deleting project: ${error.message}` });
  }
});

const addFavoriteProject = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const projectId = req.params.projectId;

  try {
    const user = await User.findById(userId);
    if (!user) {
      // throw new Error("User not found");
      return res.status(500).json({
        message: `User not found}`,
      });
    }

    const result = await user.addFavoriteProject(projectId);
    if (!result.success) {
      return res.status(500).json({
        message: `Error adding project to favorites: ${result.message}`,
      });
    }

    res.json({ message: "Project added to favorites" });
  } catch (error) {
    // console.error("Error adding project to favorites:", error);
    res
      .status(500)
      .json({ message: `Error adding project to favorites: ${error.message}` });
  }
});

const removeFavoriteProject = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const projectId = req.params.projectId;

  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    const result = await user.removeFavoriteProject(projectId);
    if (!result.success) {
      throw new Error(result.message);
    }

    res.json({ message: "Project removed from favorites" });
  } catch (error) {
    // console.error("Error removing project from favorites:", error);
    res.status(500).json({
      message: `Error removing project from favorites: ${error.message}`,
    });
  }
});

const getFavorites = asyncHandler(async (req, res) => {
  // const userId = req.params.userId;
  const userId = req.user._id;

  // console.log("File: userControllers.js", "Line 252:", userId);

  try {
    const user = await User.findById(userId).populate("favorites");
    if (!user) {
      throw new Error("User not found");
    }

    if (user.favorites.length === 0) {
      return res.json({ message: "User has no favorite projects" });
    }

    res.json(user.favorites);
  } catch (error) {
    // console.error("Error getting favorite projects:", error);
    res
      .status(500)
      .json({ message: `Error getting favorite projects: ${error.message}` });
  }
});

const updateUserPassword = asyncHandler(async (req, res) => {
  try {
    const { email, newPassword } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    // Update the user's password
    user.password = newPassword;
    await user.save();

    res.json({ message: "Password updated successfully", user });
  } catch (error) {
    // Handle any errors that occur during the update process
    res
      .status(500)
      .json({ message: "Error updating password", error: error.message });
  }
});

const htmlPageForRestPassword = asyncHandler(async (req, res) => {
  // Retrieve the email from query parameters
  const { email } = req.query;

  const baseUrl = `${req.protocol}://${req.get("host")}${
    req.path
  }?email=${email}`;

  // console.log("Base URL:", baseUrl);

  // Log the retrieved email for debugging
  // console.log("File: userControllers.js", "Line 298:", email);

  // HTML content with a form to update the password
  const htmlContent = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Update Password</title>
  <style>
    body {
      background-color: #D7E5FF; /* Light blue background color for the body */
      font-family: Arial, sans-serif; /* Font family for better readability */
    }
  
    h1 {
      color: darkblue; /* Dark blue color for the heading */
    }
  
    form {
      background-color: white; /* White background for the form */
      padding: 20px; /* Add some padding to the form */
      border-radius: 10px; /* Rounded corners for the form */
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); /* Box shadow for a slight elevation effect */
    }
  
    label {
      display: block; /* Make labels block elements for better alignment */
      margin-bottom: 5px; /* Add some space below each label */
    }
  
    input[type="password"] {
      width: 100%; /* Make the input fields take up the full width */
      padding: 8px; /* Add some padding to the input fields */
      margin-bottom: 15px; /* Add some space below each input field */
      border-radius: 5px; /* Rounded corners for the input fields */
      border: 1px solid #ccc; /* Add a border to the input fields */
      box-sizing: border-box; /* Include padding and border in the element's total width and height */
    }
  
    button[type="submit"] {
      background-color: darkblue; /* Dark blue background color for the submit button */
      color: white; /* White text color for the submit button */
      padding: 10px 20px; /* Add some padding to the button */
      border: none; /* Remove the border */
      border-radius: 5px; /* Rounded corners for the button */
      cursor: pointer; /* Change cursor to pointer on hover */
      transition: background-color 0.3s; /* Add a smooth transition for the background color */
    }
  
    button[type="submit"]:hover {
      background-color: #003366; /* Darker blue background color on hover */
    }
  </style>
  </head>
  <body>
  
  <h1>Update Password</h1>
  
  <form id="updatePasswordForm">
    <label for="newPassword">New Password:</label>
    <input type="password" id="newPassword" name="newPassword" required>
    
    <label for="confirmNewPassword">Confirm New Password:</label>
    <input type="password" id="confirmNewPassword" name="confirmNewPassword" required>
    
    <!-- Hidden input field to store the email -->
    <input type="hidden" id="email" name="email" value="${email}">
    
    <button type="submit">Update Password</button>
  </form>
  
  <script>
    const form = document.getElementById('updatePasswordForm');
    form.addEventListener('submit', async function(event) {
      event.preventDefault(); // Prevent the default form submission
      
      const newPassword = document.getElementById('newPassword').value;
      const confirmNewPassword = document.getElementById('confirmNewPassword').value;
      const email = document.getElementById('email').value;
      
      // Perform client-side validation
      if (newPassword !== confirmNewPassword) {
        alert('New password and confirm new password do not match.');
        return;
      }
      
      // Make AJAX request to update password
      try {
        const response = await fetch('/api/user/update_password', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ email, newPassword })
        });
        
        if (!response.ok) {
          throw new Error('Failed to update password');
        }
        
        alert('Password updated successfully!');
        // Redirect to another page if needed
      } catch (error) {
        alert('Failed to update password: ' + error.message);
      }
    });
  </script>
  
  </body>
  </html>
  
  `;

  // Send the HTML content as the response
  res.send(htmlContent);
});

module.exports = {
  registerUser,
  authUser,
  allUsers,
  updateUserinfoAdmin,
  allUsersV2,
  updateUserinfo,
  deleteUser,
  getOneuser,
  getFavorites,
  removeFavoriteProject,
  addFavoriteProject,
  htmlPageForRestPassword,
  updateUserPassword,
};
