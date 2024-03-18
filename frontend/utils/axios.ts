import Axios from "axios";

export const axios = Axios.create({
  // baseURL: "http://localhost:3000/dev" || process.env.API_HOST,
  baseURL: process.env.API_HOST,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});
