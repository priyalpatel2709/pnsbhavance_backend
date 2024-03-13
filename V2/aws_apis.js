const express = require("express");
const dotenv = require("dotenv");
const { S3Client, PutObjectCommand ,GetObjectCommand ,ListObjectsV2Command } = require("@aws-sdk/client-s3");
const { fromIni } = require("@aws-sdk/credential-provider-ini");
const multer = require("multer");
const { Readable } = require("stream");

dotenv.config();
const app = express();

app.listen(3001, () => {
  // console.log("Server is running on port 3001");
});

const s3Client = new S3Client({
  region: "ap-south-1",
  credentials: {
    accessKeyId: process.env.ACCESS_KEY,
    secretAccessKey: process.env.ACCESS_SECRET,
  },
});

const BUCKET = process.env.BUCKET;

const storage = multer.memoryStorage();
const upload = multer({ storage }).single("file");

const uploadParams = {
  Bucket: BUCKET,
  ACL: "public-read",
};

app.post("/upload", upload, async (req, res) => {
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).send("No file uploaded.");
    }
    const uploadResponse = await uploadFileToS3(file);
    res.send("Successfully uploaded " + uploadResponse.Location + " location!");
  } catch (error) {
    // console.error("Error uploading file:", error);
    res.status(500).send("Error uploading file" + error);
  }
});

async function uploadFileToS3(file) {
  uploadParams.Key = file.originalname;
  uploadParams.Body = file.buffer;

  const command = new PutObjectCommand(uploadParams);

  try {
    const response = await s3Client.send(command);
    const location = `https://${BUCKET}.s3.amazonaws.com/${file.originalname}`;
    return { Location: location }; // Constructing the location manually
  } catch (err) {
    console.error("Error uploading file:", err);
    throw err;
  }
}

app.get("/list", async (req, res) => {
  try {
    const listParams = {
      Bucket: BUCKET,
    };
    const command = new ListObjectsV2Command(listParams);
    const response = await s3Client.send(command);
    const keys = response.Contents.map((item) => item.Key);
    res.send(keys);
  } catch (error) {
    res.status(500).send("Error listing objects");
  }
});

app.get("/download/:filename", async (req, res) => {
  try {
    const filename = req.params.filename;
    const downloadParams = {
      Bucket: BUCKET,
      Key: filename,
    };
    const command = new GetObjectCommand(downloadParams);
    const response = await s3Client.send(command);
    const stream = Readable.from(response.Body);
    res.setHeader("Content-Type", response.ContentType);
    stream.pipe(res);
  } catch (error) {
    res.status(500).send("Error downloading file" +error);
  }
});

app.delete("/delete/:filename", async (req, res) => {
  try {
    const filename = req.params.filename;
    const deleteParams = {
      Bucket: BUCKET,
      Key: filename,
    };
    const command = new DeleteObjectCommand(deleteParams);
    await s3Client.send(command);
    res.send("File Deleted Successfully");
  } catch (error) {
    res.status(500).send("Error deleting file");
  }
});
