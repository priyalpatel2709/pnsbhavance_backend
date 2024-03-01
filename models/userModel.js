const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userModel = mongoose.Schema(
  {
    phone: { type: "String", default: "" },
    password: { type: "String",},
    name: { type: "String", required: true },
    email: { type: "String", unique: true, required: true },
    isAdmin: {
      type: Boolean,
      required: true,
      default: false,
    },
    subscription: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Subscription" },
    ],
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

const User = mongoose.model("User", userModel);
module.exports = User;
