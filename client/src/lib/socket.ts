import { io } from "socket.io-client";


const socket = io("http://localhost:5000", {
  path: "/socket.io/",
  transports: ["websocket"],
  autoConnect: false,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
  withCredentials: true
});
export default socket;