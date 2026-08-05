const { createValidationError } = require("./validation");

const DEFAULT_PAGE_SIZE = 20;
const MAX_PAGE_SIZE = 100;

const parsePositiveInteger = (value, fallback, field, max = Number.MAX_SAFE_INTEGER) => {
  if (value === undefined || value === "") return fallback;

  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed < 1 || parsed > max) {
    throw createValidationError(`${field} must be a whole number from 1 to ${max}`);
  }

  return parsed;
};

const parsePagination = (query = {}, options = {}) => {
  const defaultLimit = options.defaultLimit || DEFAULT_PAGE_SIZE;
  const maxLimit = options.maxLimit || MAX_PAGE_SIZE;
  const page = parsePositiveInteger(query.page, 1, "Page", 1000000);
  const limit = parsePositiveInteger(query.limit, defaultLimit, "Limit", maxLimit);
  const sortFields = options.sortFields || ["createdAt"];
  const defaultSort = options.defaultSort || sortFields[0];
  const sortBy = query.sortBy || defaultSort;

  if (!sortFields.includes(sortBy)) {
    throw createValidationError("Sort field is invalid");
  }

  const direction = String(query.sortDirection || options.defaultDirection || "desc").toLowerCase();
  if (!['asc', 'desc'].includes(direction)) {
    throw createValidationError("Sort direction must be asc or desc");
  }

  const sortValue = direction === "asc" ? 1 : -1;
  return {
    page,
    limit,
    skip: (page - 1) * limit,
    sort: { [sortBy]: sortValue, _id: sortValue },
  };
};

const paginationMeta = ({ page, limit, total }) => {
  const totalPages = Math.max(Math.ceil(total / limit), 1);
  return {
    page,
    limit,
    total,
    totalPages,
    hasNext: page < totalPages,
    hasPrevious: page > 1,
  };
};

module.exports = { DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE, parsePagination, paginationMeta };
