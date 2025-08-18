import axios from "axios";

const api = axios.create({
  baseURL: "https://backend.postbox4all.xyz", // adjust as per backend
});

// Add Authorization header if token exists
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ---- API Functions ----
export async function loginRequest(username: string, password: string) {
  const response = await api.post("/auth/signin", { username, password });
  return response.data; // { access_token, token_type, role }
}
export const signupRequest = async (data: {
  name: string;
  email: string;
  password: string;
  role: string;
}) => {
  const response = await api.post("/auth/signup", data);
  return response.data; // { message: "User registered successfully" }
};

export default api;
