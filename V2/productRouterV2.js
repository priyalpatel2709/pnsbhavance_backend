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

const multer = require("multer");

// Set up Multer
const storage = multer.memoryStorage();
const upload = multer({ storage }).single("brochurepdf");

// router.route("/addprojectinfo").post(protect, addprojectinfo);
router.post("/addprojectinfo", protect, upload, addprojectinfo);
router.route("/getallproject").get(protect, getallprogect);
// router.route("/updateproject/:projectId").put(protect, updateprojectdata);
router.put("/updateproject/:projectId", protect, upload, updateprojectdata);
router.route("/deleteproject/:projectId").delete(protect, deleteProject);
router
  .route("/deleteprojectimage/:projectId")
  .put(protect, deleteItemFromProject);

module.exports = router;
