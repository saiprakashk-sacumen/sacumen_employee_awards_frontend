// api.ts
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

// ---- Auth ----
export async function loginRequest(username: string, password: string) {
  const response = await api.post("/auth/signin", { username, password });
  return response.data;
}
export const signupRequest = async (data: {
  name: string;
  email: string;
  password: string;
  role: string;
}) => {
  const response = await api.post("/auth/signup", data);
  return response.data;
};

// ---- Onboarding Manager ----
export const getOnboardingMetrics = async () => {
  const res = await api.get("/onboarding/metrics");
  return res.data;
};

export const getUsers = async () => {
  const res = await api.get("/users");
  return res.data;
};

export const getManagers = async () => {
  const res = await api.get("/managers/");
  return res.data;
};

export const getProjects = async () => {
  const res = await api.get<string[]>("/projects/");
  return res.data;
};

export const getEmployeesByProject = async (
  projectName: string
): Promise<string[]> => {
  const res = await api.get(`/projects/${projectName}/employees`);
  return res.data;
};

export async function submitNomination(data: {
  nominee_id: string;
  project_name: string;
  justification_text: string;
  customer_email: string;
  core_value: string;
  rating: number;
  nomination_type: string;
}) {
  const response = await api.post("/nominations/", data);
  return response.data;
}

export const getManagerProjectMappings = async (
  page: number,
  pageSize: number,
  search: string,
  filters: { managerId: string; projectId: string }
) => {
  const res = await api.get("/mappings", {
    params: {
      page,
      pageSize,
      search,
      ...filters,
    },
  });
  return res.data;
};

export const assignManagerToProject = async (
  projectName: string,
  managerId: number
) => {
  const res = await api.patch(
    `/projects/${encodeURIComponent(projectName)}/assign_manager/${managerId}`
  );
  return res.data;
};

export const exportManagerProjectMappings = async (format: string) => {
  const res = await api.get(`/mappings/export`, {
    params: { format },
    responseType: "blob", // for file download
  });
  return res;
};

export default api;
