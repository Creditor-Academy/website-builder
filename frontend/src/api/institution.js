import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api/v1/organizations",
  withCredentials: true
});

const institutionApi = {
  create: (data) => API.post("/", data),
  list: () => API.get("/"),
  getDetailedList: () => API.get("/detailed"),
  getById: (id) => API.get(`/${id}`),
  update: (id, data) => API.put(`/${id}`, data),
  delete: (id) => API.delete(`/${id}`)
};

export default institutionApi;
