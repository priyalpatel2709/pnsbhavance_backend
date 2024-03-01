const asyncHandler = require("express-async-handler");
const generateToken = require("../config/generateToken");
const Project = require("../models/projectModle");

const addprojectinfo = asyncHandler(async (req, res) => {
  try {
    // Extract data from the request body
    const {
      projectname,
      dailyUpdates,
      layouts,
      projectImages,
      projectlocation,
      shortDescription,
      longdescription,
      queansdescription,
      projectlogo,
      brochurepdfUrl,
      projectaddress,
    } = req.body;

    // Check if the user is an admin
    if (!req.user.isAdmin) {
      return res
        .status(403)
        .json({ message: "Only admins can perform this action." });
    }

    // Check if the project name already exists
    const projectnameExists = await Project.findOne({ projectname });
    if (projectnameExists) {
      return res.status(400).json({ message: "Project name already exists." });
    }

    // Validate required fields
    if (!projectname || !projectlocation || !shortDescription) {
      return res.status(400).json({
        message: "Project name, location, and short description are required.",
      });
    }

    // Create a new project document
    const newProject = new Project({
      projectname,
      dailyUpdates,
      layouts,
      projectImages,
      projectlocation,
      shortDescription,
      longdescription,
      queansdescription,
      projectlogo,
      brochurepdfUrl,
      projectaddress,
    });

    // Save the project to the database
    const savedProject = await newProject.save();

    // Respond with the saved project data
    res.status(200).json(savedProject);
  } catch (error) {
    console.error("Error adding project:", error);
    res.status(500).json({ message: "Internal server error." });
  }
});

const getallprogect = asyncHandler(async (req, res) => {
  try {
    // Fetch all projects
    const allProjects = await Project.find();

    // Send the projects as a JSON response
    res.json(allProjects);
  } catch (error) {
    // If an error occurs, send an error response
    res.status(500).json({ error: "Internal server error" });
  }
});

const updateprojectdata = asyncHandler(async (req, res) => {
  const projectId = req.params.projectId;
  const { field, index, newData } = req.body;

  // Check if the user is an admin
  if (!req.user.isAdmin) {
    return res
      .status(403)
      .json({ message: "Only admins can perform this action." });
  }

  try {
    let updateQuery = {};

    // Check if the field to update is projectname, projectlocation, or queansdescription
    if (
      field === "projectname" ||
      field === "projectlocation" ||
      field === "projectlogo" ||
      field === "brochurepdfUrl" ||
      field === "shortDescription" ||
      field === "longdescription"
    ) {
      updateQuery[field] = newData; // Update the specified field directly
    } else if (field === "queansdescription") {
      // Update the question and answer at the specified index in queansdescription array
      updateQuery[`${field}.${index}.question`] = newData.question;
      updateQuery[`${field}.${index}.answer`] = newData.answer;
    } else {
      // Construct the update query based on the specified array and index
      updateQuery[`${field}.${index}`] = newData;
    }

    // Find the project by its ID and update the specified field or array element
    const updatedProject = await Project.findByIdAndUpdate(
      projectId,
      updateQuery,
      { new: true }
    );

    if (!updatedProject) {
      // If the project is not found, return an error
      throw new Error("Project not found");
    }

    res.json(updatedProject); // Return the updated project
  } catch (error) {
    // Handle any errors that occur during the update process
    res
      .status(500)
      .json({ message: `Error updating project: ${error.message}` });
  }
});

const deleteProject = asyncHandler(async (req, res) => {
  const projectId = req.params.projectId;

  // Check if the user is an admin
  if (!req.user.isAdmin) {
    return res
      .status(403)
      .json({ message: "Only admins can perform this action." });
  }

  try {
    // Find the project by its ID and delete it
    const deletedProject = await Project.findByIdAndDelete(projectId);

    if (!deletedProject) {
      // If the project is not found, return an error
      throw new Error("Project not found");
    }

    res.json({ message: "Project deleted successfully" });
  } catch (error) {
    // Handle any errors that occur during the delete process
    console.error("Error deleting project:", error);
    res
      .status(500)
      .json({ message: `Error deleting project: ${error.message}` });
  }
});

const deleteItemFromProject = asyncHandler(async (req, res) => {
  const projectId = req.params.projectId;
  const { field, index } = req.body;

  // Check if the user is an admin
  if (!req.user.isAdmin) {
    return res
      .status(403)
      .json({ message: "Only admins can perform this action." });
  }

  try {
    // Find the project by its ID
    const project = await Project.findById(projectId);

    if (!project) {
      // If the project is not found, return a 404 error
      return res.status(404).json({ message: "Project not found" });
    }

    // Check if the field exists in the project and it is an array
    if (!project[field] || !Array.isArray(project[field])) {
      return res
        .status(400)
        .json({ message: "Invalid field or field is not an array" });
    }

    // Check if the index is valid
    if (index < 0 || index >= project[field].length) {
      return res.status(400).json({ message: "Invalid index" });
    }

    // Remove the item at the specified index from the specified field
    project[field].splice(index, 1);

    // Save the updated project
    const updatedProject = await project.save();

    res.json(updatedProject);
  } catch (error) {
    // Handle any errors that occur during the update process
    console.error("Error deleting item from project:", error);
    res
      .status(500)
      .json({ message: `Error deleting item from project: ${error.message}` });
  }
});

module.exports = {
  addprojectinfo,
  getallprogect,
  updateprojectdata,
  deleteProject,
  deleteItemFromProject,
};
