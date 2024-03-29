const asyncHandler = require("express-async-handler");
const { uploadFileToS3, deleteFileFromS3 } = require("../helper/upload");
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
    } else {
      return res.status(500).json({ message: "File Not Found" });
    }

    res.json({ fileUrls });
  } catch (error) {
    // console.error("Error uploading file:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

const deleteFilefromS3 = async (req, res) => {
  const { fileName } = req.body;
  try {
    const deleteResult = await deleteFileFromS3(fileName);

    res.json({ deleteResult });
  } catch (error) {
    // console.error("Error uploading file:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

module.exports = { uploadFileMiddleware, deleteFilefromS3 };
