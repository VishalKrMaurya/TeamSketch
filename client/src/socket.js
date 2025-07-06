import { io } from "socket.io-client";

const socket = io("http://localhost:5000"); // Make sure backend runs on 5000

export default socket;
