const crypto = require("crypto");
const RateLimitRecord = require("../models/RateLimitRecord");

class MongoRateLimitStore {
  constructor(prefix) {
    this.prefix = prefix;
    this.windowMs = 15 * 60 * 1000;
    this.localKeys = false;
  }

  init(options) {
    this.windowMs = options.windowMs;
  }

  normalizeKey(rawKey) {
    return crypto.createHash("sha256").update(`${this.prefix}:${rawKey}`).digest("hex");
  }

  async increment(rawKey) {
    const key = this.normalizeKey(rawKey);
    const now = new Date();
    const resetAt = new Date(now.getTime() + this.windowMs);
    const update = [{ $set: {
      key: { $ifNull: ["$key", key] },
      count: { $cond: [{ $gt: ["$resetAt", now] }, { $add: [{ $ifNull: ["$count", 0] }, 1] }, 1] },
      resetAt: { $cond: [{ $gt: ["$resetAt", now] }, "$resetAt", resetAt] },
    } }];
    const write = (upsert) => RateLimitRecord.findOneAndUpdate({ key }, update, { new: true, upsert }).lean();
    let record;
    try {
      record = await write(true);
    } catch (error) {
      if (error?.code !== 11000) throw error;
      record = await write(false);
    }

    return { totalHits: record.count, resetTime: record.resetAt };
  }

  async decrement(rawKey) {
    await RateLimitRecord.updateOne(
      { key: this.normalizeKey(rawKey), count: { $gt: 0 } },
      { $inc: { count: -1 } }
    );
  }

  async resetKey(rawKey) {
    await RateLimitRecord.deleteOne({ key: this.normalizeKey(rawKey) });
  }
}

module.exports = MongoRateLimitStore;
