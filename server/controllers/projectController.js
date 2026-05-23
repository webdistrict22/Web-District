const Project = require("../models/Project");
const asyncHandler = require("../middleware/asyncHandler");

const createSlug = (text) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
};

const createProject = asyncHandler(async (req, res) => {
  const {
    title,
    websiteType,
    businessType,
    shortDescription,
    fullDescription,
    keyFeatures,
    pagesIncluded,
    tags,
    images,
    liveUrl,
    caseStudyUrl,
    isFeatured,
    isVisible,
    order,
  } = req.body;

  if (!title || !websiteType || !shortDescription) {
    res.status(400);
    throw new Error("Title, website type, and short description are required");
  }

  const baseSlug = createSlug(title);
  let slug = baseSlug;
  let counter = 1;

  while (await Project.findOne({ slug })) {
    slug = `${baseSlug}-${counter}`;
    counter++;
  }

  const project = await Project.create({
    title,
    slug,
    websiteType,
    businessType,
    shortDescription,
    fullDescription,
    keyFeatures,
    pagesIncluded,
    tags,
    images,
    liveUrl,
    caseStudyUrl,
    isFeatured,
    isVisible,
    order,
  });

  res.status(201).json({
    success: true,
    message: "Project created successfully",
    project,
  });
});

const getPublicProjects = asyncHandler(async (req, res) => {
  const { featured, tag, websiteType } = req.query;

  const query = { isVisible: true };

  if (featured === "true") query.isFeatured = true;
  if (tag) query.tags = tag;
  if (websiteType) query.websiteType = websiteType;

  const projects = await Project.find(query).sort({ order: 1, createdAt: -1 });

  res.json({
    success: true,
    count: projects.length,
    projects,
  });
});

const getAllProjects = asyncHandler(async (req, res) => {
  const projects = await Project.find().sort({ order: 1, createdAt: -1 });

  res.json({
    success: true,
    count: projects.length,
    projects,
  });
});

const getProjectBySlug = asyncHandler(async (req, res) => {
  const project = await Project.findOne({
    slug: req.params.slug,
    isVisible: true,
  });

  if (!project) {
    res.status(404);
    throw new Error("Project not found");
  }

  res.json({
    success: true,
    project,
  });
});

const updateProject = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id);

  if (!project) {
    res.status(404);
    throw new Error("Project not found");
  }

  const fields = [
    "title",
    "websiteType",
    "businessType",
    "shortDescription",
    "fullDescription",
    "keyFeatures",
    "pagesIncluded",
    "tags",
    "images",
    "liveUrl",
    "caseStudyUrl",
    "isFeatured",
    "isVisible",
    "order",
  ];

  fields.forEach((field) => {
    if (req.body[field] !== undefined) {
      project[field] = req.body[field];
    }
  });

  if (req.body.title && req.body.title !== project.title) {
    project.slug = createSlug(req.body.title);
  }

  const updatedProject = await project.save();

  res.json({
    success: true,
    message: "Project updated successfully",
    project: updatedProject,
  });
});

const deleteProject = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id);

  if (!project) {
    res.status(404);
    throw new Error("Project not found");
  }

  await project.deleteOne();

  res.json({
    success: true,
    message: "Project deleted successfully",
  });
});

module.exports = {
  createProject,
  getPublicProjects,
  getAllProjects,
  getProjectBySlug,
  updateProject,
  deleteProject,
};