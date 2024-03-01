const express = require("express");

const {
  addAppinfo,
  getappinfo,
  updateAppinfo,
} = require("../controllers/appInfoControllers");

const router = express.Router();

router.route("/addappinfo").post(addAppinfo);
router.route("/getAppInfo").get(getappinfo);
router.route("/updateAppinfo").put(updateAppinfo);

module.exports = router;
