const mongoose = require("mongoose");

const appInfoData = mongoose.Schema(
  {
    appVresion: { type: "String" },
    appUpdateVersion: { type: "String" },
    appforceUpdateVersion: { type: "String" },
    appname: { type: "String" },
    message: { type: "String" },
  },
  { timestaps: true }
);

const appInfo = mongoose.model("AppInfo", appInfoData);
module.exports = appInfo;
