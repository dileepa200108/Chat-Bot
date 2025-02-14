import axios from "axios";

// Determine API URL dynamically
const getBaseURL = () => {
  if (window.location.origin === "http://localhost:5173") {
    return "http://localhost:3000"; // Use local backend when on localhost
  }
  return import.meta.env.VITE_API_URL || "https://projectcodebase-production.up.railway.app/";
};

const api = axios.create({
  baseURL: getBaseURL(),
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
