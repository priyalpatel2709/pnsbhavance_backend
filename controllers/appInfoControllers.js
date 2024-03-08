const asyncHandler = require("express-async-handler");
const appInfo = require("../models/appInfoModel");

const addAppinfo = asyncHandler(async (req, res) => {
  try {
    var newAppinfo = {
      appVresion: req.body.appVresion,
      appUpdateVersion: req.body.appUpdateVersion,
      appforceUpdateVersion: req.body.appforceUpdateVersion,
      appname: req.body.appname,
      message: req.body.message,
    };
    var appinfo = await appInfo.create(newAppinfo);
    res.json(appinfo);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

const getappinfo = asyncHandler(async (req, res) => {
  try {
    let appinfo = await appInfo.findOne({
      appname: req.query.appname,
    });
    // if (!appinfo) {
    //   return res.status(404).json({ message: "App info not found" });
    // }
    res.json({ appName: appinfo.appName, ...appinfo._doc });
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

const updateAppinfo = asyncHandler(async (req, res) => {
  const {
    appId,
    appVresion,
    appUpdateVersion,
    appforceUpdateVersion,
    appname,
    message,
  } = req.body;
  try {
    const updatedAppinfo = await appInfo.findByIdAndUpdate(
      appId,
      {
        appVresion: appVresion,
        appUpdateVersion: appUpdateVersion,
        appforceUpdateVersion: appforceUpdateVersion,
        appname: appname,
        message: message,
      },
      { new: true } // This option returns the modified document rather than the original one
    );

    if (!updatedAppinfo) {
      res.status(404);
      throw new Error("App Info Not Found");
    } else {
      res.json({ message: "update is done !!!", updatedAppinfo });
    }
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

module.exports = { addAppinfo, getappinfo, updateAppinfo };
