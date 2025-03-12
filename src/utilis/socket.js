import { io } from "socket.io-client";

const SOCKET_URL = "http://localhost:3000"; // Apne backend ka URL dal

const socket = io('http://localhost:3000', {
  withCredentials: true,
  autoConnect: true,
  transports: ['websocket'],
});

export default socket;
