const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:4000";

const getToken = () => {
  return localStorage.getItem("token");
};

const apiRequest = async (url, options = {}) => {
  const token = getToken();

  const response = await fetch(`${API_BASE_URL}${url}`, {
    ...options,

    headers: {
      "Content-Type": "application/json",
      ...(token
        ? {
            Authorization: `Bearer ${token}`,
          }
        : {}),
      ...(options.headers || {}),
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Something went wrong");
  }

  return data;
};


// Get sadhana for a particular date
export const getSadhanaByDate = async (date) => {
  return apiRequest(`/api/sadhana/${date}`);
};


// Create sadhana
export const createSadhana = async (data) => {
  return apiRequest("/api/sadhana", {
    method: "POST",
    body: JSON.stringify(data),
  });
};


// Update sadhana
export const updateSadhana = async (date, data) => {
  return apiRequest(`/api/sadhana/${date}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
};


// Get all marks for graph
export const getMarksGraph = async () => {
  return apiRequest("/api/reports/marks-graph");
};


// Get marks summary
export const getMarksSummary = async () => {
  return apiRequest("/api/reports/marks-summary");
};

