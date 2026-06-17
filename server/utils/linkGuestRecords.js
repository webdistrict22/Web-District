const mongoose = require("mongoose");
const WebsiteRequest = require("../models/WebsiteRequest");
const Appointment = require("../models/Appointment");
const Contract = require("../models/Contract");

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const emptyCounts = () => ({
  linkedRequests: 0,
  linkedAppointments: 0,
  linkedContracts: 0,
});

const normalizeEmail = (value) => {
  if (typeof value !== "string") return "";

  const email = value.trim().toLowerCase();

  return emailPattern.test(email) ? email : "";
};

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const buildEmailMatch = (field, normalizedEmail) => ({
  [field]: {
    $regex: new RegExp(`^\\s*${escapeRegex(normalizedEmail)}\\s*$`, "i"),
  },
});

const getUserId = (userOrId) => {
  const candidate =
    userOrId && typeof userOrId === "object"
      ? userOrId._id || userOrId.id
      : userOrId;

  if (!candidate) return null;

  if (typeof candidate === "string") {
    return mongoose.Types.ObjectId.isValid(candidate) ? candidate : null;
  }

  return candidate;
};

const getModifiedCount = (result) =>
  Number(result?.modifiedCount ?? result?.nModified ?? result?.n ?? 0);

const findIds = async (Model, filter) => {
  const query = Model.find(filter);
  const selectedQuery =
    query && typeof query.select === "function" ? query.select("_id") : query;
  const docs =
    selectedQuery && typeof selectedQuery.lean === "function"
      ? await selectedQuery.lean()
      : await selectedQuery;

  return (docs || []).map((doc) => doc._id).filter(Boolean);
};

const updateUnclaimedByIds = async (Model, ids, emailFilter, userId) => {
  if (!ids.length) return 0;

  const result = await Model.updateMany(
    {
      _id: { $in: ids },
      client: null,
      ...emailFilter,
    },
    {
      $set: {
        client: userId,
      },
    }
  );

  return getModifiedCount(result);
};

const linkGuestRecords = async (userOrId, emailOverride, options = {}) => {
  const userId = getUserId(userOrId);
  const normalizedEmail = normalizeEmail(
    emailOverride ||
      (userOrId && typeof userOrId === "object" ? userOrId.email : "")
  );

  if (!userId || !normalizedEmail) {
    return emptyCounts();
  }

  if (
    userOrId &&
    typeof userOrId === "object" &&
    userOrId.role &&
    userOrId.role !== "client"
  ) {
    return emptyCounts();
  }

  const models = {
    WebsiteRequest,
    Appointment,
    Contract,
    ...(options.models || {}),
  };

  const requestEmailFilter = buildEmailMatch("email", normalizedEmail);
  const appointmentEmailFilter = buildEmailMatch("email", normalizedEmail);

  const requestIds = await findIds(models.WebsiteRequest, {
    client: null,
    ...requestEmailFilter,
  });
  const appointmentIds = await findIds(models.Appointment, {
    client: null,
    ...appointmentEmailFilter,
  });

  const [linkedRequests, linkedAppointments] = await Promise.all([
    updateUnclaimedByIds(
      models.WebsiteRequest,
      requestIds,
      requestEmailFilter,
      userId
    ),
    updateUnclaimedByIds(
      models.Appointment,
      appointmentIds,
      appointmentEmailFilter,
      userId
    ),
  ]);

  const contractReferences = [];

  if (requestIds.length) {
    contractReferences.push({ request: { $in: requestIds } });
  }

  if (appointmentIds.length) {
    contractReferences.push({ appointment: { $in: appointmentIds } });
  }

  let linkedContracts = 0;

  if (contractReferences.length) {
    const contractResult = await models.Contract.updateMany(
      {
        client: null,
        $or: contractReferences,
        ...buildEmailMatch("clientEmail", normalizedEmail),
      },
      {
        $set: {
          client: userId,
        },
      }
    );

    linkedContracts = getModifiedCount(contractResult);
  }

  return {
    linkedRequests,
    linkedAppointments,
    linkedContracts,
  };
};

module.exports = {
  linkGuestRecords,
  normalizeEmail,
};
