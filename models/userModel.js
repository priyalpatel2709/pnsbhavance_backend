const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userModel = mongoose.Schema(
  {
    phone: { type: "String", default: "" },
    password: { type: "String" },
    name: { type: "String", required: true },
    email: { type: "String", unique: true, required: true },
    isAdmin: {
      type: Boolean,
      required: true,
      default: false,
    },
    favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: "Projects" }],
    subscription: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Subscription" },
    ],
    pic: {
      type: "String",
      required: true,
      default:
        "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg",
    },
    whatsappNumber: { type: "String", default: "" },
    isActive: {
      type: Boolean,
      required: true,
      default: true,
    },
  },
  { timestaps: true }
);

userModel.methods.matchPassword = async function (enteredPassword) {
  if (enteredPassword === this.password) {
    return true;
  } else {
    return false;
  }
  // return await bcrypt.compare(enteredPassword, this.password);
};

// userModel.pre("save", async function (next) {
//   if (!this.isModified("password")) { // Fixed the check here
//     return next();
//   }

//   const salt = await bcrypt.genSalt(10);
//   this.password = await bcrypt.hash(this.password, salt);
//   next();
// });

userModel.methods.addFavoriteProject = async function (projectId) {
  try {
    // Check if the project is already in favorites
    if (this.favorites.includes(projectId)) {
      return { success: false, message: "Project already in favorites" };
    }
    // Check if the project is already in favorites
    if (!this.favorites.includes(projectId)) {
      // Add the project to favorites
      this.favorites.push(projectId);
      // Save the user
      await this.save();
      return { success: true, message: "Project added to favorites" };
    } else {
      return { success: false, message: "Project already in favorites" };
    }
  } catch (error) {
    return { success: false, message: "Could not add project to favorites" };
  }
};

// Method to remove a project from user's favorites
userModel.methods.removeFavoriteProject = async function (projectId) {
  try {
    // Check if the project is in favorites
    const index = this.favorites.indexOf(projectId);
    if (index !== -1) {
      // Remove the project from favorites
      this.favorites.splice(index, 1);
      // Save the user
      await this.save();
      return { success: true, message: "Project removed from favorites" };
    } else {
      return { success: false, message: "Project not found in favorites" };
    }
  } catch (error) {
    return {
      success: false,
      message: "Could not remove project from favorites",
    };
  }
};

const User = mongoose.model("User", userModel);
module.exports = User;
