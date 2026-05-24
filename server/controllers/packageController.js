const Package = require("../models/Package");
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

const createPackage = asyncHandler(async (req, res) => {
  const {
    name,
    shortDescription,
    websiteType,
    features,
    bestFor,
    priceLabel,
    isCustom,
    isFeatured,
    isVisible,
    order,
  } = req.body;

  if (!name || !shortDescription || !websiteType) {
    res.status(400);
    throw new Error("Name, short description, and website type are required");
  }

  const baseSlug = createSlug(name);
  let slug = baseSlug;
  let counter = 1;

  while (await Package.findOne({ slug })) {
    slug = `${baseSlug}-${counter}`;
    counter++;
  }

  const packageItem = await Package.create({
    name,
    slug,
    shortDescription,
    websiteType,
    features,
    bestFor,
    priceLabel,
    isCustom,
    isFeatured,
    isVisible,
    order,
  });

  res.status(201).json({
    success: true,
    message: "Package created successfully",
    package: packageItem,
  });
});

const getPublicPackages = asyncHandler(async (req, res) => {
  const { featured, websiteType } = req.query;

  const query = { isVisible: true };

  if (featured === "true") {
    query.isFeatured = true;
  }

  if (websiteType) {
    query.websiteType = websiteType;
  }

  const packages = await Package.find(query).sort({
    order: 1,
    createdAt: -1,
  });

  res.json({
    success: true,
    count: packages.length,
    packages,
  });
});

const getAllPackages = asyncHandler(async (req, res) => {
  const packages = await Package.find().sort({ order: 1, createdAt: -1 });

  res.json({
    success: true,
    count: packages.length,
    packages,
  });
});

const updatePackage = asyncHandler(async (req, res) => {
  const packageItem = await Package.findById(req.params.id);

  if (!packageItem) {
    res.status(404);
    throw new Error("Package not found");
  }

  const fields = [
    "name",
    "shortDescription",
    "websiteType",
    "features",
    "bestFor",
    "priceLabel",
    "isCustom",
    "isFeatured",
    "isVisible",
    "order",
  ];

  fields.forEach((field) => {
    if (req.body[field] !== undefined) {
      packageItem[field] = req.body[field];
    }
  });

  const updatedPackage = await packageItem.save();

  res.json({
    success: true,
    message: "Package updated successfully",
    package: updatedPackage,
  });
});

const deletePackage = asyncHandler(async (req, res) => {
  const packageItem = await Package.findById(req.params.id);

  if (!packageItem) {
    res.status(404);
    throw new Error("Package not found");
  }

  await packageItem.deleteOne();

  res.json({
    success: true,
    message: "Package deleted successfully",
  });
});

module.exports = {
  createPackage,
  getPublicPackages,
  getAllPackages,
  updatePackage,
  deletePackage,
};
