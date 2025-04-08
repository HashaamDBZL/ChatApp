// socket.ts
import { io } from "socket.io-client";
const socket = io(import.meta.env.VITE_BACKEND_URL, { autoConnect: false }); // ⛔ don't connect on import
export default socket;
