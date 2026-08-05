const mongoose = require("mongoose");

const withMongoTransaction = async (work) => {
  const session = await mongoose.startSession();
  let result;

  try {
    await session.withTransaction(async () => {
      result = await work(session);
    });
    return result;
  } catch (error) {
    if (/Transaction numbers are only allowed|replica set|transaction/i.test(error.message || "")) {
      error.statusCode = 503;
      error.code = "TRANSACTIONS_REQUIRED";
      error.message = "This operation requires a transaction-capable MongoDB deployment";
    }
    throw error;
  } finally {
    await session.endSession();
  }
};

module.exports = { withMongoTransaction };
