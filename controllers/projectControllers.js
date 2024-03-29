const asyncHandler = require("express-async-handler");
const generateToken = require("../config/generateToken");
const Project = require("../models/projectModle");
const NodeCache = require("node-cache");
const nodeCache = new NodeCache();

// const addprojectinfo = asyncHandler(async (req, res) => {
//   try {
//     // Extract data from the request body
//     const {
//       projectname,
//       dailyUpdates,
//       layouts,
//       projectImages,
//       projectlocation,
//       shortDescription,
//       longdescription,
//       queansdescription,
//       projectlogo,
//       brochurepdfUrl,
//       projectaddress,
//     } = req.body;

//     // Check if the user is an admin
//     if (!req.user.isAdmin) {
//       return res
//         .status(403)
//         .json({ message: "Only admins can perform this action." });
//     }

//     // Check if the project name already exists
//     const projectnameExists = await Project.findOne({ projectname });
//     if (projectnameExists) {
//       return res.status(400).json({ message: "Project name already exists." });
//     }

//     // Validate required fields
//     if (!projectname || !projectlocation || !shortDescription) {
//       return res.status(400).json({
//         message: "Project name, location, and short description are required.",
//       });
//     }

//     // Create a new project document
//     const newProject = new Project({
//       projectname,
//       dailyUpdates,
//       layouts,
//       projectImages,
//       projectlocation,
//       shortDescription,
//       longdescription,
//       queansdescription,
//       projectlogo,
//       brochurepdfUrl,
//       projectaddress,
//     });

//     // Save the project to the database
//     const savedProject = await newProject.save();

//     //add to cache
//     // nodeCache.set("projects", JSON.stringify(savedProject));

//     // Respond with the saved project data
//     res.status(200).json(savedProject);
//   } catch (error) {
//     // console.error("Error adding project:", error);
//     res.status(500).json({ message: "Internal server error." });
//   }
// });

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

    // Add the saved project to the cache
    if (nodeCache.has("projects")) {
      let cachedProjects = JSON.parse(nodeCache.get("projects"));
      cachedProjects.push(savedProject);
      nodeCache.set("projects", JSON.stringify(cachedProjects));
    } else {
      nodeCache.set("projects", JSON.stringify([savedProject]));
    }

    // Respond with the saved project data
    res.status(200).json(savedProject);
  } catch (error) {
    // console.error("Error adding project:", error);
    res.status(500).json({ message: "Internal server error." });
  }
});


// const getallprogect = asyncHandler(async (req, res) => {
//   try {
//     let allProjects;
//     // Fetch all projects

//     if (nodeCache.has("projects")) {
//       allProjects = JSON.parse(nodeCache.get("projects"));
//     } else {
//       allProjects = await Project.find();
//       nodeCache.set("projects", JSON.stringify(savedProject));
//     }

//     // Send the projects as a JSON response
//     res.json(allProjects);
//   } catch (error) {
//     // If an error occurs, send an error response
//     res.status(500).json({ error: "Internal server error" });
//   }
// });

const getallprogect = asyncHandler(async (req, res) => {
  try {
    let allProjects;

    // Fetch all projects from cache if available
    if (nodeCache.has("projects")) {
      allProjects = JSON.parse(nodeCache.get("projects"));
    } else {
      // If projects are not cached, fetch them from the database
      allProjects = await Project.find();

      // Cache the fetched projects for future requests
      nodeCache.set("projects", JSON.stringify(allProjects));
    }

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
    nodeCache.del("projects");
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
    nodeCache.del("projects");
    res.json({ message: "Project deleted successfully" });
  } catch (error) {
    // Handle any errors that occur during the delete process
    // console.error("Error deleting project:", error);
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
    nodeCache.del("projects");
    res.json(updatedProject);
  } catch (error) {
    // Handle any errors that occur during the update process
    // console.error("Error deleting item from project:", error);
    res
      .status(500)
      .json({ message: `Error deleting item from project: ${error.message}` });
  }
});

const getoneProject = asyncHandler(async (req, res) => {
  try {
    const projectId = req.params.projectId;
    const project = await Project.findById(projectId);
    res.json(project);
  } catch (error) {
    res.status(500).json({ error: `Internal server error ${error}` });
  }
});

const addMultipleImages = asyncHandler(async (req, res) => {
  try {
    const projectId = req.params.projectId;
    const { field, newData } = req.body;

    // Find the project by ID
    const project = await Project.findById(projectId);

    // Check if the project exists
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }
    // Update the specified field with the new image URLs
    switch (field) {
      case "projectImages":
        project.projectImages.push(...newData);
        break;
      case "layouts":
        project.layouts.push(...newData);
        break;
      case "dailyUpdates":
        project.dailyUpdates.push(...newData);
        break;
      default:
        return res.status(400).json({ message: "Invalid field name" });
    }
    await project.save();
    nodeCache.del("projects");
    res.status(200).json({ message: "Images added successfully" });
  } catch (error) {
    console.error("Error adding images:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = {
  addprojectinfo,
  getallprogect,
  updateprojectdata,
  deleteProject,
  deleteItemFromProject,
  getoneProject,
  addMultipleImages,
};
