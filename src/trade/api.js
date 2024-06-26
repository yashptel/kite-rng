import axios from "axios";
import config from "../config";
import { store } from "../store";

const http = axios.create({
  baseURL: config.proxyServer,
});

http.interceptors.request.use(
  (config) => {
    store.dispatch({ type: "SET_IS_LOADING", payload: true });
    return config;
  },
  (error) => {
    store.dispatch({ type: "SET_IS_LOADING", payload: false });
    return Promise.reject(error);
  }
);

http.interceptors.response.use(
  (response) => {
    store.dispatch({ type: "SET_IS_LOADING", payload: false });
    return response;
  },
  (error) => {
    store.dispatch({ type: "SET_IS_LOADING", payload: false });
    return Promise.reject(error);
  }
);

export default http;
