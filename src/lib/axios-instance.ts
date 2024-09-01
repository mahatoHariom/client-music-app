import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import Cookie from "js-cookie";

interface RefreshQueueItem {
  resolve: (value: void | PromiseLike<void>) => void;
  reject: (reason?: any) => void;
}

let isRefreshing = false;
let refreshQueue: RefreshQueueItem[] = [];
const baseURL = process.env.NEXT_PUBLIC_API_URL;

const api: AxiosInstance = axios.create({

  baseURL: baseURL || "http://localhost:9000/api/v1",
  withCredentials: true,
});

const handleTokenError = () => {
  Cookie.remove("accessToken");
  Cookie.remove("refreshToken");
  window.location.href = "/login";
};

// Handle the queue after refreshing token
const handleQueue = (error?: any) => {
  while (refreshQueue.length) {
    const { resolve, reject } = refreshQueue.shift()!;
    if (error) {
      reject(error);
    } else {
      resolve();
    }
  }
};

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = Cookie.get("accessToken");
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    if (!error.response) {
      return Promise.reject(error);
    }

    const { status, data } = error.response;
    const { message } = data;

    if (status === 401 && message) {
      if (
        [
          "NO_ACCESS_TOKEN",
          "NO_REFRESH_TOKEN",
          "INVALID_REFRESH_TOKEN",
          "MISSING_REFRESH_TOKEN",
          "INVALID_OR_EXPIRED_REFRESH_TOKEN",
          "BEARER_TOKEN_MISSING",
        ].includes(message)
      ) {
        handleTokenError();
        return Promise.reject(error);
      }

      if (!originalRequest._retry) {
        originalRequest._retry = true;

        if (!isRefreshing) {
          isRefreshing = true;
          try {
            const response = await api.post("/auth/refresh");
            const newAccessToken = response.data.accessToken;
            Cookie.set("accessToken", newAccessToken);
            originalRequest.headers = originalRequest.headers || {};
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
            handleQueue();
            return api(originalRequest);
          } catch (refreshError) {
            handleTokenError();
            handleQueue(refreshError);
            return Promise.reject(refreshError);
          } finally {
            isRefreshing = false;
          }
        } else {
          return new Promise<void>((resolve, reject) => {
            refreshQueue.push({ resolve, reject });
          })
            .then(() => api(originalRequest))
            .catch((queueError) => Promise.reject(queueError));
        }
      }
    }

    return Promise.reject(error);
  }
);

export default api;
