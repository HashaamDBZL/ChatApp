// socket.ts
import { io } from "socket.io-client";
const socket = io("http://localhost:3000", { autoConnect: false }); // ⛔ don't connect on import
export default socket;
