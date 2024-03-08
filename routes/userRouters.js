const express = require("express");
const {
  registerUser,
  authUser,
  allUsers,
  updateUserinfoAdmin,
  allUsersV2,
  updateUserinfo,
  deleteUser,
} = require("../controllers/userControllers");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");

router.route("/").post(registerUser).get(protect, allUsers); //sign in user
router.post("/login", authUser); // login user
router.post("/updateuserAdmin/:userId", updateUserinfoAdmin);

router.route("/getallusers").get(allUsersV2);
router.route("/updateuser").put(updateUserinfo);
router.route("/deleteuser/:userId").delete(protect, deleteUser);

module.exports = router;
