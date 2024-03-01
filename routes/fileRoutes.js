const express = require("express");
const { uploadFileMiddleware } = require("../controllers/fileControllers");
const { protect } = require("../middleware/authMiddleware");
const router = express.Router();

const multer = require("multer");

// Set up Multer
const storage = multer.memoryStorage();
const upload = multer({ storage }).array("brochurepdf", 10); 

router.post("/uploadtos3", upload, uploadFileMiddleware);
module.exports = router;
