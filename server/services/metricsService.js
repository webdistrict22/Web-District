const state = { requests: 0, errors5xx: 0, authFailures: 0, durations: [], startedAt: new Date() };

const recordRequest = (status, duration) => {
  state.requests += 1;
  if (status >= 500) state.errors5xx += 1;
  if (status === 401 || status === 403) state.authFailures += 1;
  state.durations.push(duration);
  if (state.durations.length > 1000) state.durations.splice(0, state.durations.length - 1000);
};

const snapshot = () => {
  const sorted = [...state.durations].sort((a, b) => a - b);
  const percentile = (ratio) => sorted.length ? sorted[Math.min(Math.floor(sorted.length * ratio), sorted.length - 1)] : null;
  return {
    requestCount: state.requests,
    errors5xx: state.errors5xx,
    recentAuthFailureCount: state.authFailures,
    latencyMs: { p50: percentile(0.5), p95: percentile(0.95), samples: sorted.length },
    startedAt: state.startedAt,
  };
};

module.exports = { recordRequest, snapshot };
