// socket.ts
import { Server } from "socket.io";
import http from "http";

let io: Server;

// Function to initialize the socket with the server instance
export const initSocket = (server: http.Server) => {
  io = new Server(server, {
    cors: {
      origin: "*", // Change this as needed to specify allowed origins
      methods: ["GET", "POST"],
    },
  });

  // WebSocket event handling
  io.on("connection", (socket) => {
    console.log("New client connected");

    // Listen for status updates on specific job ID
    socket.on("job-status", (jobId) => {
      socket.join(jobId); // Join the specific job room
      io.to(jobId).emit(jobId, { status:"Subscribe for job status successfully " });
    });

    socket.on("disconnect", () => {
      console.log("Client disconnected");
    });
  });

  return io;
};

// Function to get the initialized io instance
export const getSocket = () => {
  if (!io) {
    throw new Error("Socket.io has not been initialized");
  }
  return io;
};
