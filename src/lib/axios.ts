import axios from "axios";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const root = (process.env.NEXT_PUBLIC_ROOT_DOMAIN ?? "").split(":")[0];
    const host = window.location.hostname;
    if (host.endsWith(`.${root}`)) {
      config.headers["X-Tenant-Slug"] = host.slice(0, -(root.length + 1));
    }
  }
  // attach token here, e.g. from your auth store
  // const token = useAuthStore.getState().token;
  // if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      // handle logout / refresh here
    }
    return Promise.reject(error);
  },
);
