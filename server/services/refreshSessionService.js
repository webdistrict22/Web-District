const crypto = require("crypto");
const RefreshSession = require("../models/RefreshSession");
const User = require("../models/User");
const { refreshDays } = require("../utils/cookies");
const { withMongoTransaction } = require("./transactionService");

const secret = () => {
  const value = String(process.env.REFRESH_TOKEN_SECRET || "");
  if (value.length < 32) throw new Error("REFRESH_TOKEN_SECRET must contain at least 32 characters");
  return value;
};
const hashToken = (token) => crypto.createHmac("sha256", secret()).update(String(token)).digest("hex");
const hashUserAgent = (value) => crypto.createHash("sha256").update(String(value || "unknown").slice(0, 500)).digest("hex");
const newToken = () => crypto.randomBytes(48).toString("base64url");

const createRefreshSession = async (user, req, { session, family } = {}) => {
  const token = newToken();
  const [refreshSession] = await RefreshSession.create([{
    user: user._id,
    tokenHash: hashToken(token),
    sessionFamily: family || crypto.randomUUID(),
    expiresAt: new Date(Date.now() + refreshDays() * 86400000),
    userAgentHash: hashUserAgent(req.get("User-Agent")),
    tokenVersion: Number(user.tokenVersion || 0),
  }], { session });
  return { token, refreshSession };
};

const revokeFamily = (sessionFamily, reason) => RefreshSession.updateMany(
  { sessionFamily, revokedAt: null },
  { $set: { revokedAt: new Date(), revokeReason: reason } }
);

const rotateRefreshSession = async (rawToken, req) => {
  if (!rawToken) return { error: "missing" };
  const current = await RefreshSession.findOne({ tokenHash: hashToken(rawToken) }).select("+tokenHash");
  if (!current) return { error: "invalid" };
  if (current.revokedAt || current.replacedBy) {
    await revokeFamily(current.sessionFamily, "refresh-token-reuse");
    return { error: "reuse" };
  }
  if (current.expiresAt <= new Date()) return { error: "expired" };
  const user = await User.findById(current.user).select("+tokenVersion");
  if (!user || !user.isActive || Number(user.tokenVersion || 0) !== current.tokenVersion) {
    await revokeFamily(current.sessionFamily, "user-session-invalid");
    return { error: "invalid" };
  }

  try {
    return await withMongoTransaction(async (session) => {
      const claimed = await RefreshSession.findOneAndUpdate(
        { _id: current._id, revokedAt: null, replacedBy: null, expiresAt: { $gt: new Date() } },
        { $set: { revokedAt: new Date(), rotatedAt: new Date(), revokeReason: "rotated", lastUsedAt: new Date() } },
        { new: true, session }
      );
      if (!claimed) {
        const error = new Error("Refresh token was already rotated");
        error.code = "REFRESH_REUSE";
        throw error;
      }
      const created = await createRefreshSession(user, req, { session, family: current.sessionFamily });
      claimed.replacedBy = created.refreshSession._id;
      await claimed.save({ session });
      return { user, token: created.token };
    });
  } catch (error) {
    if (error.code === "REFRESH_REUSE") {
      await revokeFamily(current.sessionFamily, "refresh-token-reuse");
      return { error: "reuse" };
    }
    throw error;
  }
};

const revokeToken = async (rawToken, reason = "logout") => {
  if (!rawToken) return;
  await RefreshSession.updateOne({ tokenHash: hashToken(rawToken), revokedAt: null }, { $set: { revokedAt: new Date(), revokeReason: reason } });
};
const revokeAllUserSessions = (userId, reason, { session } = {}) => RefreshSession.updateMany(
  { user: userId, revokedAt: null },
  { $set: { revokedAt: new Date(), revokeReason: reason } },
  { session }
);

module.exports = { hashToken, createRefreshSession, rotateRefreshSession, revokeToken, revokeFamily, revokeAllUserSessions };
