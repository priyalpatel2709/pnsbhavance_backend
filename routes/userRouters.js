const express = require("express");
const {
  registerUser,
  authUser,
  allUsers,
  updateUserinfo,
  allUsersV2
} = require("../controllers/userControllers");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");

router.route("/").post(registerUser).get(protect, allUsers); //sign in user
router.post("/login", authUser); // login user
router.post("/updateuser/:userId", updateUserinfo);

router.route("/getallusers").get(allUsersV2);

module.exports = router;
