const asyncHandler = require("express-async-handler");
const generateToken = require("../config/generateToken");
const ExcelJS = require("exceljs");
const User = require("../models/userModel");
const admin = require("firebase-admin");
// const bcrypt = require("bcryptjs");

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, isAdmin, password, phone, pic, whatsappNumber } =
    req.body;
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
    whatsappNumber,
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
      whatsappNumber: user.whatsappNumber,
    });
  } else {
    res.status(400);
    throw new Error("Fail To Create User  :(");
  }
});

const varifyUser = asyncHandler(async (req, res) => {
  const { email } = req.body;

  await admin.auth().updateUser(email, {
    emailVerified: true,
  });
  res.status(200).json({ message: "Done" });
});

const authUser = asyncHandler(async (req, res) => {
  const { email, password, ispasswordReq } = req.body;

  const user = await User.findOne({ email });

  if (user && !ispasswordReq) {
    // If user exists and password verification is not required
    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
      pic: user.pic,
      isAdmin: user.isAdmin,
      isActive: user.isActive,
      whatsappNumber: user.whatsappNumber,
      // deviceToken: user.deviceToken,
    });
  } else if (user && (await user.matchPassword(password))) {
    // If user exists and password matches
    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
      pic: user.pic,
      isAdmin: user.isAdmin,
      isActive: user.isActive,
      whatsappNumber: user.whatsappNumber,
      // deviceToken: user.deviceToken,
    });
  } else {
    // If user doesn't exist or password doesn't match
    res.status(400).json({ error: "Email or Password is incorrect" });
  }
});

const downloadUserData = async (req, res) => {
  try {
    const users = await User.find().lean(); // Assuming User is your Mongoose model

    // Create a new workbook and worksheet
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Users");

    // Define headers
    const headers = [
      "Name",
      "Email",
      "Phone",
      "isAdmin",
      "Pic",
      "WhatsappNumber",
      "isActive",
    ];
    worksheet.addRow(headers);

    // Add user data to the worksheet
    users.forEach((user) => {
      const row = [
        user.name,
        user.email,
        user.phone || "", // Handle null or undefined values
        user.isAdmin ? "Yes" : "No", // Convert boolean to string
        user.pic,
        user.whatsappNumber || "", // Handle null or undefined values
        user.isActive ? "Active" : "Inactive", // Convert boolean to string
      ];
      worksheet.addRow(row);
    });

    // Save the workbook to a buffer
    const buffer = await workbook.xlsx.writeBuffer();

    // Send the buffer as a downloadable file
    res.set({
      "Content-Type":
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": "attachment; filename=user_data.xlsx",
      "Content-Length": buffer.length,
    });
    res.send(buffer);
  } catch (error) {
    console.error("Error downloading user data:", error);
    res.status(500).json({
      message: `Error downloading user data: ${error}`,
    });
  }
};

async function downloadUserDataV2() {
  try {
    // Fetch user data from the database
    const users = await User.find().lean(); // Assuming User is your Mongoose model

    // Create a new workbook and worksheet
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Users");

    // Define headers
    const headers = [
      "Name",
      "Email",
      "Phone",
      "isAdmin",
      "Pic",
      "WhatsappNumber",
      "isActive",
    ];
    worksheet.addRow(headers);

    // Add user data to the worksheet
    users.forEach((user) => {
      const row = [
        user.name,
        user.email,
        user.phone || "", // Handle null or undefined values
        user.isAdmin ? "Yes" : "No", // Convert boolean to string
        user.pic,
        user.whatsappNumber || "", // Handle null or undefined values
        user.isActive ? "Active" : "Inactive", // Convert boolean to string
      ];
      worksheet.addRow(row);
    });

    // Save the workbook to a file
    await workbook.xlsx.writeFile("user_data.xlsx");
    res.status(200).json({
      message: "User data downloaded successfully.",
    });
    // console.log("User data downloaded successfully.");
  } catch (error) {
    res.status(500).json({
      message: `Error downloading user data:", ${error}`,
    });
    console.error("Error downloading user data:", error);
  }
}

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
  const { name, isAdmin, password, phone, isActive, pic, whatsappNumber } =
    req.body;
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
      whatsappNumber: whatsappNumber,
    },
    { new: true }
  );

  if (!updatrdUser) {
    res.status(404);
    throw new Error("User Info Not Found");
  } else {
    await updatrdUser.populate("favorites", "projectname");

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

  try {
    const user = await User.findById(userId).populate(
      "favorites",
      "projectname"
    );
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

  const htmlContent = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Update Password</title>
  <style>
      body {
          background-color: #D7E5FF;
          font-family: Arial, sans-serif;
      }
  
      h1 {
          color: darkblue;
      }
  
      form {
          background-color: white;
          padding: 20px;
          border-radius: 10px;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
      }
  
      label {
          display: block;
          margin-bottom: 5px;
      }
  
      input[type="password"] {
          width: 100%;
          padding: 8px;
          margin-bottom: 15px;
          border-radius: 5px;
          border: 1px solid #ccc;
          box-sizing: border-box;
      }
  
      button[type="submit"] {
          background-color: darkblue;
          color: white;
          padding: 10px 20px;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          transition: background-color 0.3s;
      }
  
      button[type="submit"]:hover {
          background-color: #003366;
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
      function validatePassword(inputString) {
          const pattern = /^(?=.*?[A-Z])(?=(.*[a-z]){1,})(?=(.*[\d]){1,})(?=(.*[\W]){1,})(?!.*\s).{8,}$/;
          return pattern.test(inputString);
      }
  
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
  
          // Validate the new password
          if (!validatePassword(newPassword)) {
              alert('Password must contain at least one uppercase letter, one lowercase letter, one digit, one special character, and be at least 8 characters long.');
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
  varifyUser,
  downloadUserData,
};
