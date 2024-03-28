const asyncHandler = require("express-async-handler");
const appInfo = require("../models/appInfoModel");
const NodeCache = require("node-cache");

const nodeCache = new NodeCache();
const addAppinfo = asyncHandler(async (req, res) => {
  try {
    let appinfo;
    var newAppinfo = {
      appVresion: req.body.appVresion,
      appUpdateVersion: req.body.appUpdateVersion,
      appforceUpdateVersion: req.body.appforceUpdateVersion,
      appname: req.body.appname,
      message: req.body.message,
    };
    appinfo = await appInfo.create(newAppinfo);
    nodeCache.set("appInfo", JSON.stringify(appinfo));
    res.json(appinfo);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

const getappinfo = asyncHandler(async (req, res) => {
  try {
    let appinfo;

    if (nodeCache.has("appInfo")) {
      appinfo = JSON.parse(nodeCache.get("appInfo"));
    } else {
      appinfo = await appInfo.findOne({
        appname: req.query.appname,
      });

      nodeCache.set("appInfo", JSON.stringify(appinfo));
    }

    if (!appinfo) {
      return res.status(404).json({ message: "App info not found" });
    }

    res.json(appinfo);
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
    appupdatemessage,
  } = req.body;
  try {
    const updatedAppinfo = await appInfo.findByIdAndUpdate(
      appId,
      {
        appVresion: appVresion,
        appUpdateVersion: appUpdateVersion,
        appforceUpdateVersion: appforceUpdateVersion,
        appname: appname,
        message: appupdatemessage,
      },
      { new: true } // This option returns the modified document rather than the original one
    );

    if (!updatedAppinfo) {
      res.status(404);
      throw new Error("App Info Not Found");
    } else {
      res.json({ message: "update is done !!!", updatedAppinfo });
      nodeCache.del("appInfo");
    }
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

module.exports = { addAppinfo, getappinfo, updateAppinfo };
