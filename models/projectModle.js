const mongoose = require("mongoose");

const projectsModel = mongoose.Schema(
  {
    projectname: { type: "String", required: true },
    dailyUpdates: [{ type: "String" }],
    layouts: [{ type: "String" }],
    projectImages: [{ type: "String" }],
    projectlocation: { type: "String", required: true },
    shortDescription: { type: "String", required: true },
    longdescription: { type: "String" },
    queansdescription: [
      {
        question: { type: "String" },
        answer: { type: "String" },
      },
    ],
    projectlogo: { type: "String", required: true },
    brochurepdfUrl: { type: "String" },
    projectaddress: [
      {
        city: { type: "String" },
        area: { type: "String" },
        postcode: { type: "String" },
        landmark: { type: "String" },
      },
    ],
  },
  { timestamps: true }
);

const Projects = mongoose.model("Projects", projectsModel);
module.exports = Projects;
