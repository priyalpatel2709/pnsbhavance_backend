const express = require("express");
const {
  addprojectinfo,
  getallprogect,
  updateprojectdata,
  deleteProject,
  deleteItemFromProject,
} = require("../controllers/projectControllers");
const { protect } = require("../middleware/authMiddleware");
const router = express.Router();

router.route("/addprojectinfo").post(protect, addprojectinfo);
router.route("/getallproject").get(getallprogect);
router.route("/updateproject/:projectId").put(protect, updateprojectdata);
router.route("/deleteproject/:projectId").delete(protect, deleteProject);
router
  .route("/deleteprojectimage/:projectId")
  .put(protect, deleteItemFromProject);

module.exports = router;
