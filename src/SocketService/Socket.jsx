
import { io } from "socket.io-client";

const socket = io("https://faithful-motivation-production.up.railway.app", {
  withCredentials: true,
});

export default socket;
