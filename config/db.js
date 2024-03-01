const mongoose = require("mongoose");
const colors = require("colors");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`MongoDB Connected:`.underline.bgGreen);
    // console.log('File: db.js', 'Line 15:', conn.connection);
  } catch (error) {
    console.log(`Error: ${error.message}`.bgRed.bold);
    process.exit();
  }
};

module.exports = connectDB;
