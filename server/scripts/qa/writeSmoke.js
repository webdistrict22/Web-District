const crypto = require("crypto");
const {
  API_BASE_URL,
  assertArray,
  assertOkJson,
  isProductionTarget,
  isTrue,
  loginAdmin,
  printHeader,
  request,
} = require("./helpers");

const createTestIdentity = () => {
  const timestamp = Date.now();
  const suffix = crypto.randomBytes(3).toString("hex");

  return {
    name: `QA Test Client ${suffix}`,
    businessName: "QA Test - Web District",
    email: `qa.web.district+${timestamp}.${suffix}@example.com`,
    phone: "01000000000",
    password: `QaTest-${suffix}-Pass9`,
  };
};

const run = async () => {
  printHeader("Write-flow smoke test");
  console.log(`API base: ${API_BASE_URL}`);

  if (!isTrue(process.env.QA_RUN_WRITE_TESTS)) {
    console.log(
      "[SKIP] Write tests are disabled. Set QA_RUN_WRITE_TESTS=true to enable them."
    );
    return { skipped: true, reason: "QA_RUN_WRITE_TESTS is not true" };
  }

  if (
    isProductionTarget() &&
    !isTrue(process.env.QA_ALLOW_PRODUCTION_WRITES)
  ) {
    throw new Error(
      "Refusing production writes. Set QA_ALLOW_PRODUCTION_WRITES=true only when intentional."
    );
  }

  const admin = await loginAdmin();

  if (admin.skipped) {
    throw new Error(
      "Write tests require QA_ADMIN_EMAIL and QA_ADMIN_PASSWORD before any data is created."
    );
  }

  const identity = createTestIdentity();
  let clientId = "";
  let requestId = "";
  let requestDeleted = false;
  let outcome;
  let runError;

  try {
    const signup = await request("/auth/signup", {
      method: "POST",
      body: identity,
    });
    assertOkJson(signup, "Client signup");

    clientId = signup.data?.user?._id || "";

    if (!clientId || !signup.data?.token) {
      throw new Error("Client signup did not return a user ID and token");
    }

    console.log(`[PASS] Client signup - created ${clientId}`);

    const login = await request("/auth/login", {
      method: "POST",
      body: {
        email: identity.email,
        password: identity.password,
      },
    });
    assertOkJson(login, "Client login");

    const clientToken = login.data?.token;

    if (!clientToken) {
      throw new Error("Client login did not return a token");
    }

    console.log("[PASS] Client login");

    const createdRequest = await request("/requests", {
      method: "POST",
      token: clientToken,
      body: {
        name: identity.name,
        businessName: identity.businessName,
        phone: identity.phone,
        email: identity.email,
        websiteType: "Business Website",
        hasBrandIdentity: "Not sure",
        hasContentReady: "Partially",
        budgetRange: "QA Test",
        deadline: "QA Test",
        projectDetails:
          "QA Test - automated deployment smoke request. Safe to delete.",
        preferredContactMethod: "Email",
      },
    });
    assertOkJson(createdRequest, "Website request submission");

    requestId = createdRequest.data?.request?._id || "";

    if (!requestId) {
      throw new Error("Website request submission did not return an ID");
    }

    console.log(`[PASS] Website request submission - created ${requestId}`);

    const myRequests = await request("/requests/my", {
      token: clientToken,
    });
    assertOkJson(myRequests, "Client request verification");
    assertArray(myRequests.data?.requests, "client requests");

    if (
      !myRequests.data.requests.some(
        (websiteRequest) => websiteRequest._id === requestId
      )
    ) {
      throw new Error("Created request was not returned by /requests/my");
    }

    console.log("[PASS] Client request verification");

    const adminRequests = await request(
      `/requests?search=${encodeURIComponent(identity.email)}`,
      { token: admin.token }
    );
    assertOkJson(adminRequests, "Admin request verification");
    assertArray(adminRequests.data?.requests, "admin requests");

    if (
      !adminRequests.data.requests.some(
        (websiteRequest) => websiteRequest._id === requestId
      )
    ) {
      throw new Error("Created request was not visible to the admin");
    }

    console.log("[PASS] Admin request verification");

    outcome = {
      skipped: false,
      clientId,
      email: identity.email,
      requestId,
    };
  } catch (error) {
    runError = error;
  } finally {
    if (requestId) {
      try {
        const cleanup = await request(`/requests/${requestId}`, {
          method: "DELETE",
          token: admin.token,
        });
        assertOkJson(cleanup, "Request cleanup");
        requestDeleted = true;
        console.log(`[PASS] Request cleanup - deleted ${requestId}`);
      } catch (error) {
        console.error(
          `[FAIL] Request cleanup - ${error.message}. Manual cleanup ID: ${requestId}`
        );
      }
    }

    if (clientId) {
      console.log(
        `[INFO] No user-delete endpoint exists. QA client remains: ${clientId} (${identity.email})`
      );
    }

    if (requestId && !requestDeleted) {
      console.log(`[INFO] Request requires manual cleanup: ${requestId}`);
    }
  }

  if (runError) {
    throw runError;
  }

  if (requestId && !requestDeleted) {
    throw new Error(`Request cleanup failed for ${requestId}`);
  }

  return outcome;
};

if (require.main === module) {
  run().catch((error) => {
    console.error(`[FAIL] ${error.message}`);
    process.exitCode = 1;
  });
}

module.exports = { run };
