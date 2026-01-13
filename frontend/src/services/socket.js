import { io } from "socket.io-client";

const socketUrl =
  import.meta.env.VITE_SOCKET_URL ||
  import.meta.env.VITE_BACKEND_ORIGIN ||
  "http://localhost:5000";

const socket = io(socketUrl, {
  withCredentials: true
});

export default socket;
