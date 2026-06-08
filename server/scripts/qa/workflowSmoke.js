const assert = require("assert");
const {
  getAppointmentStatusAfterContract,
  getRequestContractSentUpdate,
  shouldAdvanceRequestToContractSent,
} = require("../../utils/workflowTransitions");
const { runChecks } = require("./helpers");

const requestId = "qa-request-id";

const checks = [
  {
    label: "Draft contract does not advance request",
    run: () => {
      assert.strictEqual(
        getRequestContractSentUpdate(requestId, "Draft"),
        null
      );
      return "no update";
    },
  },
  {
    label: "Sent contract advances eligible request",
    run: () => {
      const transition = getRequestContractSentUpdate(requestId, "Sent");

      assert.strictEqual(transition.update.status, "Contract Sent");
      assert.strictEqual(
        shouldAdvanceRequestToContractSent("Sent", "In Progress"),
        true
      );
      return "Contract Sent update";
    },
  },
  {
    label: "Cancelled contract does not advance request",
    run: () => {
      assert.strictEqual(
        getRequestContractSentUpdate(requestId, "Cancelled"),
        null
      );
      return "no update";
    },
  },
  {
    label: "Completed request cannot regress",
    run: () => {
      const transition = getRequestContractSentUpdate(requestId, "Sent");

      assert.strictEqual(
        shouldAdvanceRequestToContractSent("Sent", "Completed"),
        false
      );
      assert.ok(transition.filter.status.$nin.includes("Completed"));
      return "Completed excluded";
    },
  },
  {
    label: "Pending appointment advances to Accepted",
    run: () => {
      assert.strictEqual(
        getAppointmentStatusAfterContract("Pending"),
        "Accepted"
      );
      return "Pending -> Accepted";
    },
  },
  {
    label: "Existing appointment states do not regress",
    run: () => {
      ["Accepted", "Rescheduled", "Cancelled", "Done"].forEach((status) => {
        assert.strictEqual(getAppointmentStatusAfterContract(status), status);
      });
      return "Accepted/Rescheduled/Cancelled/Done unchanged";
    },
  },
];

const run = () => runChecks("Workflow transition smoke test", checks);

if (require.main === module) {
  run().catch(() => {
    process.exitCode = 1;
  });
}

module.exports = { run };
