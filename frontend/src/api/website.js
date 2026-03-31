import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api/v1/websites",
  withCredentials: true
});

const websiteApi = {
  getWebsites: (params) => API.get("/", { params }),
  getWebsiteById: (id) => API.get(`/${id}`),
  createWebsite: (data) => API.post("/", data),
  updateWebsite: (id, data) => API.patch(`/${id}`, data),
  getWebsitesAll: (params) => API.get("/all", { params }),
  deleteWebsite: (id) => API.delete(`/${id}`)
};

export default websiteApi;
