const assert = require("assert");
const mongoose = require("mongoose");
const {
  API_BASE_URL,
  isProductionTarget,
  isTrue,
  printHeader,
} = require("./helpers");
const { linkGuestRecords } = require("../../utils/linkGuestRecords");

const id = () => new mongoose.Types.ObjectId().toString();

const sameId = (left, right) => String(left) === String(right);

const matchesValue = (actual, expected) => {
  if (expected && typeof expected === "object" && "$in" in expected) {
    return expected.$in.some((value) => sameId(value, actual));
  }

  if (expected && typeof expected === "object" && "$regex" in expected) {
    return expected.$regex.test(String(actual || ""));
  }

  if (expected === null) {
    return actual === null || actual === undefined;
  }

  return sameId(actual, expected);
};

const matchesFilter = (record, filter) =>
  Object.entries(filter).every(([field, expected]) => {
    if (field === "$or") {
      return expected.some((item) => matchesFilter(record, item));
    }

    return matchesValue(record[field], expected);
  });

const createMockModel = (records) => ({
  records,
  find(filter) {
    const found = records
      .filter((record) => matchesFilter(record, filter))
      .map((record) => ({ _id: record._id }));

    return {
      select() {
        return {
          lean: async () => found,
        };
      },
    };
  },
  async updateMany(filter, update) {
    let modifiedCount = 0;

    records.forEach((record) => {
      if (!matchesFilter(record, filter)) return;

      const nextClient = update.$set?.client;

      if (!sameId(record.client, nextClient)) {
        record.client = nextClient;
        modifiedCount += 1;
      }
    });

    return { modifiedCount };
  },
});

const run = async () => {
  printHeader("Guest record claim smoke test");

  if (!isTrue(process.env.QA_RUN_GUEST_CLAIM_TESTS)) {
    console.log(
      "[SKIP] Guest claim tests are disabled. Set QA_RUN_GUEST_CLAIM_TESTS=true to enable them."
    );
    return { skipped: true, reason: "QA_RUN_GUEST_CLAIM_TESTS is not true" };
  }

  if (
    process.env.API_BASE_URL &&
    isProductionTarget() &&
    !isTrue(process.env.QA_ALLOW_PRODUCTION_WRITES)
  ) {
    throw new Error(
      `Refusing production-target QA run for ${API_BASE_URL}. Set QA_ALLOW_PRODUCTION_WRITES=true only when intentional.`
    );
  }

  const userId = id();
  const otherUserId = id();
  const requestId = id();
  const appointmentId = id();
  const claimedElsewhereRequestId = id();
  const differentEmailRequestId = id();
  const contractFromRequestId = id();
  const contractFromAppointmentId = id();
  const draftContractId = id();
  const alreadyLinkedContractId = id();

  const websiteRequests = createMockModel([
    {
      _id: requestId,
      client: null,
      email: "  Test.User+Case@Example.COM ",
    },
    {
      _id: claimedElsewhereRequestId,
      client: otherUserId,
      email: "test.user+case@example.com",
    },
    {
      _id: differentEmailRequestId,
      client: null,
      email: "someone.else@example.com",
    },
  ]);

  const appointments = createMockModel([
    {
      _id: appointmentId,
      client: undefined,
      email: "TEST.USER+CASE@example.com",
    },
  ]);

  const contracts = createMockModel([
    {
      _id: contractFromRequestId,
      client: null,
      request: requestId,
      appointment: null,
      clientEmail: "test.user+case@example.com",
      status: "Sent",
    },
    {
      _id: contractFromAppointmentId,
      client: null,
      request: null,
      appointment: appointmentId,
      clientEmail: " TEST.USER+CASE@example.com ",
      status: "Sent",
    },
    {
      _id: draftContractId,
      client: null,
      request: requestId,
      appointment: null,
      clientEmail: "test.user+case@example.com",
      status: "Draft",
    },
    {
      _id: alreadyLinkedContractId,
      client: otherUserId,
      request: requestId,
      appointment: null,
      clientEmail: "test.user+case@example.com",
      status: "Sent",
    },
  ]);

  const counts = await linkGuestRecords(
    {
      _id: userId,
      email: " test.user+case@example.com ",
      role: "client",
    },
    undefined,
    {
      models: {
        WebsiteRequest: websiteRequests,
        Appointment: appointments,
        Contract: contracts,
      },
    }
  );

  assert.deepStrictEqual(counts, {
    linkedRequests: 1,
    linkedAppointments: 1,
    linkedContracts: 3,
  });

  assert.strictEqual(
    websiteRequests.records.find((record) => record._id === requestId).client,
    userId
  );
  assert.strictEqual(
    appointments.records.find((record) => record._id === appointmentId).client,
    userId
  );
  assert.strictEqual(
    websiteRequests.records.find(
      (record) => record._id === claimedElsewhereRequestId
    ).client,
    otherUserId
  );
  assert.strictEqual(
    websiteRequests.records.find(
      (record) => record._id === differentEmailRequestId
    ).client,
    null
  );
  assert.strictEqual(
    contracts.records.find((record) => record._id === contractFromRequestId)
      .client,
    userId
  );
  assert.strictEqual(
    contracts.records.find((record) => record._id === contractFromAppointmentId)
      .client,
    userId
  );
  assert.strictEqual(
    contracts.records.find((record) => record._id === draftContractId).client,
    userId
  );
  assert.strictEqual(
    contracts.records.find((record) => record._id === alreadyLinkedContractId)
      .client,
    otherUserId
  );
  assert.strictEqual(
    contracts.records.find((record) => record._id === draftContractId).status,
    "Draft"
  );

  const invalidCounts = await linkGuestRecords(
    {
      _id: id(),
      email: "not-an-email",
      role: "client",
    },
    undefined,
    {
      models: {
        WebsiteRequest: websiteRequests,
        Appointment: appointments,
        Contract: contracts,
      },
    }
  );

  assert.deepStrictEqual(invalidCounts, {
    linkedRequests: 0,
    linkedAppointments: 0,
    linkedContracts: 0,
  });

  console.log("[PASS] Guest request was linked by normalized email");
  console.log("[PASS] Guest appointment was linked by normalized email");
  console.log("[PASS] Already-linked records were not reassigned");
  console.log("[PASS] Different-email records were not linked");
  console.log("[PASS] Matching is case-insensitive and trim-aware");
  console.log("[PASS] Contracts from claimed records were linked safely");

  return { skipped: false };
};

if (require.main === module) {
  run().catch((error) => {
    console.error(`[FAIL] ${error.message}`);
    process.exitCode = 1;
  });
}

module.exports = { run };
