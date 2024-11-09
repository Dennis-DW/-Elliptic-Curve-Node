import axios from "axios";

const server = axios.create({
  baseURL: "https://elliptic-curve-node.onrender.com",
});

export default server;
