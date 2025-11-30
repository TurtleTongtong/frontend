// src/api/axiosConfig.js
import axios from "axios";

const api = axios.create({
//   baseURL: "http://13.125.8.150", 프록시로 인한 주석처리
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;