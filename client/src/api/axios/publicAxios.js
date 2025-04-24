import axios from 'axios';

const publicAxios = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL,
  withCredentials: false, // keep false unless your API explicitly uses cookies;
});

export default publicAxios;
