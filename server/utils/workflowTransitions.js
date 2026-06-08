const contractSentStatuses = new Set([
  "Sent",
  "Accepted",
  "In Progress",
  "Completed",
]);

const requestStatusesThatMustNotRegress = new Set([
  "Contract Sent",
  "Completed",
]);

const shouldAdvanceRequestToContractSent = (
  contractStatus,
  requestStatus
) => {
  return (
    contractSentStatuses.has(contractStatus) &&
    !requestStatusesThatMustNotRegress.has(requestStatus)
  );
};

const getRequestContractSentUpdate = (requestId, contractStatus) => {
  if (!requestId || !contractSentStatuses.has(contractStatus)) {
    return null;
  }

  return {
    filter: {
      _id: requestId,
      status: { $nin: [...requestStatusesThatMustNotRegress] },
    },
    update: {
      status: "Contract Sent",
    },
  };
};

const getAppointmentStatusAfterContract = (currentStatus) => {
  return currentStatus === "Pending" ? "Accepted" : currentStatus;
};

module.exports = {
  getAppointmentStatusAfterContract,
  getRequestContractSentUpdate,
  shouldAdvanceRequestToContractSent,
};
