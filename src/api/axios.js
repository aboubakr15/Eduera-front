const BASE_URL = process.env.REACT_APP_BASE_URL || "https://eduera-backend-production.up.railway.app";
export const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || "https://eduera-backend-production.up.railway.app";

const api = {
  defaults: {
    headers: {
      common: {},
    },
  },
};

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

const getToken = () => localStorage.getItem("access_token");

const makeRequest = async (url, options = {}, retry = false) => {
  const token = getToken();
  const queryString =
    options.params && Object.keys(options.params).length > 0
      ? "?" + new URLSearchParams(options.params).toString()
      : "";
  const fullUrl = `${BASE_URL}${url}${queryString}`;
  console.log(`API Request: ${options.method || "GET"} ${fullUrl}`);

  const isFormData = options.body instanceof FormData;

  const headers = {
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  if (!isFormData) {
    headers["Content-Type"] = "application/json";
  }

  const config = {
    ...options,
    headers,
  };

  let response;
  try {
    response = await fetch(fullUrl, config);
    console.log(`API Response: ${response.status} ${response.statusText}`);
  } catch (networkError) {
    console.log("Network error:", networkError);
    return Promise.reject(networkError);
  }

  if (response.status === 401 && !retry) {
    const originalQueryString =
      options.params && Object.keys(options.params).length > 0
        ? "?" + new URLSearchParams(options.params).toString()
        : "";
    const originalUrl = `${url}${originalQueryString}`;
    const originalRequest = { url: originalUrl, options, retry: true };

    const retryOptions = { ...options };
    delete retryOptions.params;

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      })
        .then((token) => {
          originalRequest.options.headers["Authorization"] = `Bearer ${token}`;
          return makeRequest(
            originalRequest.url,
            originalRequest.options,
            true,
          );
        })
        .catch((err) => Promise.reject(err));
    }

    const refreshToken = localStorage.getItem("refresh_token");

    if (!refreshToken) {
      window.location.href = "/login";
      return Promise.reject(new Error("No refresh token"));
    }

    originalRequest.retry = true;
    isRefreshing = true;

    try {
      const refreshResponse = await fetch(`${BASE_URL}/api/token/refresh/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refresh: refreshToken }),
      });

      if (refreshResponse.ok) {
        const data = await refreshResponse.json();
        localStorage.setItem("access_token", data.access);
        localStorage.setItem("refresh_token", data.refresh);

        processQueue(null, data.access);

        originalRequest.options.headers["Authorization"] =
          `Bearer ${data.access}`;
        return makeRequest(originalRequest.url, originalRequest.options, true);
      }
    } catch (refreshError) {
      processQueue(refreshError, null);
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      window.location.href = "/login";
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    return Promise.reject({
      response: { status: response.status, data: error },
    });
  }

  if (response.status === 204) {
    return { status: response.status, data: null };
  }

  const data = await response.json();
  return { status: response.status, data };
};

api.get = (url, options = {}) =>
  makeRequest(url, { method: "GET", ...options });
api.post = (url, data, options = {}) => {
  // لو الداتا FormData مش هنحولها لـ JSON
  const body = data instanceof FormData ? data : JSON.stringify(data);
  return makeRequest(url, { method: "POST", body, ...options });
};
api.patch = (url, data, options = {}) => {
  const body = data instanceof FormData ? data : JSON.stringify(data);
  return makeRequest(url, { method: "PATCH", body, ...options });
};
api.put = (url, data, options = {}) => {
  const body = data instanceof FormData ? data : JSON.stringify(data);
  return makeRequest(url, { method: "PUT", body, ...options });
};
api.delete = (url, options = {}) =>
  makeRequest(url, { method: "DELETE", ...options });

api.interceptors = {
  request: {
    use: (onFulfilled, onRejected) => {
      api._requestOnFulfilled = onFulfilled;
      api._requestOnRejected = onRejected;
    },
  },
  response: {
    use: (onFulfilled, onRejected) => {
      api._responseOnFulfilled = onFulfilled;
      api._responseOnRejected = onRejected;
    },
  },
};

const originalGet = api.get;
const originalPost = api.post;
const originalPatch = api.patch;
const originalPut = api.put;
const originalDelete = api.delete;

api.get = async (url, config = {}) => {
  let options = { method: "GET", ...config };
  if (api._requestOnFulfilled) {
    const modified = await api._requestOnFulfilled({ url, options });
    options = modified.options;
  }
  const response = await originalGet(url, options);
  if (api._responseOnFulfilled) {
    return api._responseOnFulfilled(response);
  }
  return response;
};

api.post = async (url, data, config = {}) => {
  const body = data instanceof FormData ? data : JSON.stringify(data);
  let options = { method: "POST", body, ...config };
  if (api._requestOnFulfilled) {
    const modified = await api._requestOnFulfilled({ url, options });
    options = modified.options;
  }
  const response = await originalPost(url, data, options);
  if (api._responseOnFulfilled) {
    return api._responseOnFulfilled(response);
  }
  return response;
};

api.patch = async (url, data, config = {}) => {
  const body = data instanceof FormData ? data : JSON.stringify(data);
  let options = { method: "PATCH", body, ...config };
  if (api._requestOnFulfilled) {
    const modified = await api._requestOnFulfilled({ url, options });
    options = modified.options;
  }
  const response = await originalPatch(url, data, options);
  if (api._responseOnFulfilled) {
    return api._responseOnFulfilled(response);
  }
  return response;
};

api.put = async (url, data, config = {}) => {
  const body = data instanceof FormData ? data : JSON.stringify(data);
  let options = { method: "PUT", body, ...config };
  if (api._requestOnFulfilled) {
    const modified = await api._requestOnFulfilled({ url, options });
    options = modified.options;
  }
  const response = await originalPut(url, data, options);
  if (api._responseOnFulfilled) {
    return api._responseOnFulfilled(response);
  }
  return response;
};

api.delete = async (url, config = {}) => {
  let options = { method: "DELETE", ...config };
  if (api._requestOnFulfilled) {
    const modified = await api._requestOnFulfilled({ url, options });
    options = modified.options;
  }
  const response = await originalDelete(url, options);
  if (api._responseOnFulfilled) {
    return api._responseOnFulfilled(response);
  }
  return response;
};

export default api;
