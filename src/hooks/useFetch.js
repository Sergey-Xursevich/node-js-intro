import { useEffect, useState } from "react";

const useFetch = (baseURL, entryPoint) => {
  const [isLoading, setIsLoading] = useState(true);
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getResponse = async (options) => {
      const promises = options.reduce((acc, item) => {
        const fetcher = async (fileName) => {
          const response = await fetch(`${baseURL}${fileName}`);

          if (response.ok) {
            return response
              .clone()
              .json()
              .catch(() => response.text());
          } else {
            throw Promise.reject(response.status);
          }
        };

        if (Array.isArray(item)) {
          item.forEach((el) => acc.push(fetcher(el)));
        } else if (item.indexOf(".txt") === -1) {
          acc.push(item);
        } else {
          acc.push(fetcher(item));
        }

        return acc;
      }, []);

      const data = await Promise.allSettled(promises);
      const successRequestList = data
        .filter(({ status }) => status === "fulfilled")
        .map(({ value }) => value);

      if (successRequestList.some((item) => Array.isArray(item))) {
        await getResponse(successRequestList);
      } else if (
        successRequestList.every(
          (item) => typeof item === "string" && item.indexOf(".txt") === -1
        )
      ) {
        setResponse(successRequestList.join(" "));
      }
    };

    const fetchData = async () => {
      try {
        await getResponse([entryPoint]);
      } catch (err) {
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [baseURL, entryPoint]);

  return { isLoading, response, error };
};

export { useFetch };
