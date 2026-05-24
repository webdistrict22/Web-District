import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../lib/axios";

function useFetch(url, options = {}) {
  const {
    immediate = true,
    params = {},
    successMessage = "",
    errorMessage = "Failed to load data.",
  } = options;

  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(Boolean(immediate));

  const execute = useCallback(
    async (override = {}) => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await api.get(url, {
          params: {
            ...params,
            ...(override.params || {}),
          },
        });

        setData(response.data);

        if (successMessage) {
          toast.success(successMessage);
        }

        return response.data;
      } catch (err) {
        setError(err);

        toast.error(err.response?.data?.message || errorMessage);

        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [url, JSON.stringify(params), successMessage, errorMessage]
  );

  useEffect(() => {
    if (immediate && url) {
      execute();
    }
  }, [immediate, url, execute]);

  return {
    data,
    setData,
    error,
    isLoading,
    refetch: execute,
  };
}

export default useFetch;