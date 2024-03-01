const mongoose = require("mongoose");

const subscriptionModel = mongoose.Schema(
  {
    Projects: [{ type: mongoose.Schema.Types.ObjectId, ref: "Project" }],
    selectedProjects: { type: mongoose.Schema.Types.ObjectId, ref: "Project" },
    price: { type: "String", required: true },
    startdate: { type: Date },
    subscriptiontype: { type: "String", required: true },
    isActive: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Subscription = mongoose.model("Subscription", subscriptionModel);
module.exports = Subscription;
