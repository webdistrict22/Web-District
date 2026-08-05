const Project = require("../models/Project");
const asyncHandler = require("../middleware/asyncHandler");
const { publicProjectDto } = require("../utils/responseDtos");
const { parsePagination, paginationMeta } = require("../utils/pagination");

const createSlug = (text) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
};

const getUniqueSlug = async (text, excludeId = null) => {
  const baseSlug = createSlug(text) || "project";
  let slug = baseSlug;
  let counter = 1;
  const query = { slug };

  if (excludeId) {
    query._id = { $ne: excludeId };
  }

  while (await Project.findOne(query)) {
    slug = `${baseSlug}-${counter}`;
    query.slug = slug;
    counter++;
  }

  return slug;
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

  const slug = await getUniqueSlug(title);

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

  const projects = await Project.find(query).sort({ order: 1, createdAt: -1 }).limit(100).lean();
  const publicProjects = projects.map(publicProjectDto);

  res.json({
    success: true,
    count: publicProjects.length,
    projects: publicProjects,
  });
});

const getAllProjects = asyncHandler(async (req, res) => {
  const { page, limit, skip } = parsePagination(req.query, { defaultLimit: 50, sortFields: ["createdAt"] });
  const [projects, total] = await Promise.all([
    Project.find().sort({ order: 1, createdAt: -1, _id: 1 }).skip(skip).limit(limit).lean(),
    Project.countDocuments(),
  ]);

  res.json({
    success: true,
    count: projects.length,
    data: projects,
    projects,
    pagination: paginationMeta({ page, limit, total }),
  });
});

const getProjectBySlug = asyncHandler(async (req, res) => {
  const project = await Project.findOne({
    slug: req.params.slug,
    isVisible: true,
  }).lean();

  if (!project) {
    res.status(404);
    throw new Error("Project not found");
  }

  res.json({
    success: true,
    project: publicProjectDto(project),
  });
});

const updateProject = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id);

  if (!project) {
    res.status(404);
    throw new Error("Project not found");
  }

  const titleChanged =
    req.body.title !== undefined && req.body.title !== project.title;

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

  if (titleChanged) {
    project.slug = await getUniqueSlug(req.body.title, project._id);
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
