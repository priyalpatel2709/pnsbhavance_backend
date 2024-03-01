const asyncHandler = require("express-async-handler");
const { uploadFileToS3 } = require("../helper/upload");
const uploadFileMiddleware = async (req, res, next) => {
  try {
    // Upload brochurepdf file to S3 if it exists
    let fileUrls = [];

    // Upload each file to S3
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const uploadResult = await uploadFileToS3(file);
        fileUrls.push(uploadResult.Location);
      }
    }
    // console.log('File: fileControllers.js', 'Line 15:',fileUrls );
    res.json({ fileUrls });
  } catch (error) {
    console.error("Error uploading file:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

module.exports = { uploadFileMiddleware };
