import test from "node:test";
import assert from "node:assert/strict";
import {
  PASSWORD_ISSUES,
  getPasswordConfirmationIssue,
  getPasswordPolicyIssue,
} from "../src/lib/passwordPolicy.js";
import {
  getSuccessPath,
  submitAndNavigateToSuccess,
} from "../src/lib/successFlow.js";

test("password policy reports the actual validation reason", () => {
  assert.equal(getPasswordPolicyIssue("short"), PASSWORD_ISSUES.tooShort);
  assert.equal(getPasswordPolicyIssue("a-simple-long-passphrase"), null);
  assert.equal(
    getPasswordPolicyIssue("password-is-long-enough"),
    PASSWORD_ISSUES.predictable,
  );
  assert.equal(
    getPasswordConfirmationIssue("a-simple-long-passphrase", "different"),
    PASSWORD_ISSUES.mismatch,
  );
});

test("success destinations distinguish request and call outcomes", () => {
  assert.equal(getSuccessPath("request"), "/success?type=request");
  assert.equal(getSuccessPath("call"), "/success?type=call");
});

test("submission navigation happens only after the API result succeeds", async () => {
  let releaseSubmission;
  const navigationCalls = [];
  const submission = new Promise((resolve) => {
    releaseSubmission = resolve;
  });
  const completion = submitAndNavigateToSuccess({
    type: "call",
    submit: () => submission,
    navigate: (...args) => navigationCalls.push(args),
  });

  assert.equal(navigationCalls.length, 0);
  releaseSubmission({ data: { success: true } });
  await completion;
  assert.equal(navigationCalls.length, 1);
  assert.equal(navigationCalls[0][0], "/success?type=call");
  assert.equal(navigationCalls[0][1].replace, true);

  await assert.rejects(
    submitAndNavigateToSuccess({
      type: "request",
      submit: async () => { throw new Error("API failed"); },
      navigate: (...args) => navigationCalls.push(args),
    }),
    /API failed/,
  );
  assert.equal(navigationCalls.length, 1);
});
