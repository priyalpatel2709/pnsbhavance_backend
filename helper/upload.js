const {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  ListObjectsV2Command,
} = require("@aws-sdk/client-s3");

const s3Client = new S3Client({
  region: "ap-south-1",
  credentials: {
    accessKeyId: "AKIATCKAO3F7XQDSE6C5",
    secretAccessKey: "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",
  },
});

const BUCKET = process.env.BUCKET;

const uploadParams = {
  Bucket: "pnsweb-bhavans",
  ACL: "public-read",
};

async function uploadFileToS3(file) {
  uploadParams.Key = file.originalname;
  uploadParams.Body = file.buffer;

  const command = new PutObjectCommand(uploadParams);

  try {
    const response = await s3Client.send(command);

    const location = `https://${uploadParams.Bucket}.s3.amazonaws.com/${file.originalname}`;

    return { Location: location }; // Constructing the location manually
  } catch (err) {
    console.error("Error uploading file:", err);
    throw err;
  }
}

module.exports = { uploadFileToS3 };
