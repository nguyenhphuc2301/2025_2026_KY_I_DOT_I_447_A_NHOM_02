import axios from "axios";

const API_URL = "http://localhost:8080/api/auth";

// Đăng nhập
export const login = async (data) => {
  return await axios.post(`${API_URL}/login`, data);
};

// Đăng ký
export const register = async (data) => {
  return await axios.post(`${API_URL}/register`, data);
};
