const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const getToken = () => localStorage.getItem("auth_token");

const request = async (path: string, options: RequestInit = {}) => {
  const token = getToken();
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  if (res.status === 401) {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("admin_session");
    window.location.href = "/signin";
    throw new Error("Unauthorized");
  }

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Request failed");
  return data;
};

export const api = {
  login: (email: string, password: string) =>
    request("/auth/login", { method: "POST", body: JSON.stringify({ email, password }) }),

  signup: (name: string, email: string, password: string) =>
    request("/auth/signup", { method: "POST", body: JSON.stringify({ name, email, password }) }),

  getEmployees: () => request("/employees"),
  getEmployee: (id: string) => request(`/employees/${id}`),
  createEmployee: (data: Record<string, unknown>) =>
    request("/employees", { method: "POST", body: JSON.stringify(data) }),
  updateEmployee: (id: string, data: Record<string, unknown>) =>
    request(`/employees/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  deleteEmployee: (id: string) =>
    request(`/employees/${id}`, { method: "DELETE" }),
};
