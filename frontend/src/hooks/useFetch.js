import { useCallback, useState } from "react";

export function useFetch() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const execute = useCallback(async ({
    url,
    method = "GET",
    headers = {},
    body,
    parseJson = true,
    throwOnError = true,
    signal,
  }) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(url, {
        method,
        headers,
        body,
        signal,
      });

      let payload = null;

      if (parseJson) {
        const text = await response.text();
        if (text) {
          try {
            payload = JSON.parse(text);
          } catch {
            payload = text;
          }
        }
      }

      if (throwOnError && !response.ok) {
        const message =
          typeof payload === "object" && payload !== null
            ? payload.message || `Request failed with status ${response.status}`
            : payload || `Request failed with status ${response.status}`;

        throw new Error(message);
      }

      const result = {
        response,
        data: payload ?? response,
      };

      setData(result.data);
      return result;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    data,
    loading,
    error,
    execute,
  };
}
