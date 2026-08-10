export const PASSWORD_POLICY = Object.freeze({
  minLength: 12,
  maxLength: 128,
});

export const PASSWORD_ISSUES = Object.freeze({
  required: "required",
  tooShort: "too-short",
  tooLong: "too-long",
  predictable: "predictable",
  mismatch: "mismatch",
});

const predictableFragments = ["password", "123456", "qwerty"];

export const getPasswordPolicyIssue = (password) => {
  if (typeof password !== "string" || !password) {
    return PASSWORD_ISSUES.required;
  }

  if (password.length < PASSWORD_POLICY.minLength) {
    return PASSWORD_ISSUES.tooShort;
  }

  if (password.length > PASSWORD_POLICY.maxLength) {
    return PASSWORD_ISSUES.tooLong;
  }

  const normalized = password.toLowerCase();
  if (
    /^(.)\1+$/.test(password) ||
    predictableFragments.some((fragment) => normalized.includes(fragment))
  ) {
    return PASSWORD_ISSUES.predictable;
  }

  return null;
};

export const getPasswordConfirmationIssue = (password, confirmation) => {
  if (typeof confirmation !== "string" || !confirmation) {
    return PASSWORD_ISSUES.required;
  }

  return password === confirmation ? null : PASSWORD_ISSUES.mismatch;
};

export const getPasswordServerIssue = (message) => {
  const normalized = String(message || "").toLowerCase();

  if (normalized.includes("too easy to guess")) {
    return PASSWORD_ISSUES.predictable;
  }
  if (normalized.includes("at least 12 characters")) {
    return PASSWORD_ISSUES.tooShort;
  }
  if (normalized.includes("128 characters or fewer")) {
    return PASSWORD_ISSUES.tooLong;
  }
  if (normalized.includes("passwords do not match")) {
    return PASSWORD_ISSUES.mismatch;
  }

  return null;
};

export const passwordIssueKey = (issue) =>
  issue ? `auth.passwordPolicy.${issue}` : null;
