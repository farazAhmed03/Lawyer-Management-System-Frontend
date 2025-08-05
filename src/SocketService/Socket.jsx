
import { io } from "socket.io-client";

const socket = io("https://faithful-motivation-production.up.railway.app", {
  withCredentials: true,
  transports: ['websocket', 'polling'],
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 2000,
});


export default socket;
