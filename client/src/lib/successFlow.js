const successTypes = new Set(["request", "call"]);

export const normalizeSuccessType = (type) =>
  successTypes.has(type) ? type : "request";

export const getSuccessPath = (type) =>
  `/success?type=${normalizeSuccessType(type)}`;

export const getSuccessNavigation = (type, state = {}) => ({
  path: getSuccessPath(type),
  options: {
    replace: true,
    state: {
      successType: normalizeSuccessType(type),
      ...state,
    },
  },
});

export const submitAndNavigateToSuccess = async ({
  beforeNavigate,
  buildState,
  navigate,
  submit,
  type,
}) => {
  const result = await submit();
  await beforeNavigate?.(result);
  const navigation = getSuccessNavigation(type, buildState?.(result) || {});
  navigate(navigation.path, navigation.options);
  return result;
};
