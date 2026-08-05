const toPlain = (value) =>
  value && typeof value.toObject === "function" ? value.toObject() : value;

const pick = (value, fields) => {
  const source = toPlain(value) || {};
  return fields.reduce((result, field) => {
    if (source[field] !== undefined) result[field] = source[field];
    return result;
  }, {});
};

const publicSettingsDto = (settings) =>
  pick(settings, [
    "agencyName", "phone", "whatsapp", "instagram", "email",
    "heroHeadline", "heroSubtext", "primaryCTA", "secondaryCTA", "footerText",
  ]);

const publicReviewDto = (review) =>
  pick(review, ["name", "businessName", "role", "rating", "message", "createdAt"]);

const publicProjectDto = (project) =>
  pick(project, [
    "title", "slug", "websiteType", "businessType", "shortDescription",
    "fullDescription", "keyFeatures", "pagesIncluded", "tags", "images",
    "liveUrl", "caseStudyUrl", "isFeatured", "order", "createdAt", "updatedAt",
  ]);

const publicPackageDto = (packageItem) =>
  pick(packageItem, ["name", "slug", "shortDescription", "websiteType", "features", "bestFor", "priceLabel", "isCustom", "isFeatured", "order"]);

const publicFaqDto = (faq) => pick(faq, ["question", "answer", "category", "order"]);

const clientContractDto = (contract) =>
  pick(contract, [
    "_id", "title", "clientName", "businessName", "websiteType", "scopeSummary",
    "pagesIncluded", "featuresIncluded", "timeline", "startDate", "deadline",
    "totalPrice", "depositPercent", "depositAmount", "remainingAmount",
    "paymentNotes", "status", "clientNotes", "createdAt", "updatedAt",
  ]);

module.exports = {
  pick,
  publicSettingsDto,
  publicReviewDto,
  publicProjectDto,
  publicPackageDto,
  publicFaqDto,
  clientContractDto,
};
