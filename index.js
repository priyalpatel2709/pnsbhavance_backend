const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");

const userRouters = require("./routes/userRouters");
const projectRouters = require("./routes/productRouters");
const appInfo = require("./routes/appInfoRoutes");
const fileRouters = require("./routes/fileRoutes");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");

const connectDB = require("./config/db");

dotenv.config();
connectDB();

const app = express();

app.use(express.json());

app.use(cors());

app.get("/", (req, resp) => {
  const htmlContent = "<h1>Hello, Srever is Running 😁</h1>";
  resp.send(htmlContent);
});

app.use("/api/user", userRouters);
app.use("/api/project", projectRouters);
app.use("/api/appinfo", appInfo);
app.use("/api/S3", fileRouters);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 9800;
const server = app.listen(PORT, () => {
  console.log(`server is running on PORT http://localhost:${PORT}`);
});
