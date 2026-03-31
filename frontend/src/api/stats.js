import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api/v1/stats",
  withCredentials: true
});

const statsApi = {
  getDashboardStats: () => API.get("/dashboard")
};

export default statsApi;
