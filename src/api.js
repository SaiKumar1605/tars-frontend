// src/api.js
import axios from "axios";

export const fetchSecureDocs = async (token) => {
  const response = await axios.get("https://tars-backend-i9c5.onrender.com/secure-docs", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};
