const express = require("express");
const {
  createProject,
  getPublicProjects,
  getAllProjects,
  getProjectBySlug,
  updateProject,
  deleteProject,
} = require("../controllers/projectController");

const { protect } = require("../middleware/authMiddleware");
const { adminOnly } = require("../middleware/adminMiddleware");

const router = express.Router();

router.get("/public", getPublicProjects);
router.get("/public/:slug", getProjectBySlug);

router.get("/", protect, adminOnly, getAllProjects);
router.post("/", protect, adminOnly, createProject);
router.put("/:id", protect, adminOnly, updateProject);
router.delete("/:id", protect, adminOnly, deleteProject);

module.exports = router;