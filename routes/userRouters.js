const express = require("express");
const {
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
} = require("../controllers/userControllers");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");

router.route("/").post(registerUser).get(protect, allUsers); //sign in user
router.post("/login", authUser); // login user
router.post("/updateuserAdmin/:userId", updateUserinfoAdmin);

router.route("/getallusers").get(allUsersV2);
router.route("/getoneusers/:userId").get(getOneuser);
router.route("/getFavorites").get(protect, getFavorites);
router
  .route("/removeFavoriteProject/:projectId")
  .put(protect, removeFavoriteProject);
router.route("/addFavoriteProject/:projectId").put(protect, addFavoriteProject);
router.route("/deleteuser/:userId").delete(protect, deleteUser);
router.route("/RestPassword").get(htmlPageForRestPassword);
router.route("/update_password").post(updateUserPassword);

module.exports = router;
