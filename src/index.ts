// index.ts
import express, { Express, Request, Response } from "express";
import http from "http";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import authRoute from "./routes/authRoute";
import interviewRoute from "./routes/interviewRoute";
import profileRoute from "./routes/profileRoute";
import swaggerUi from "swagger-ui-express";
import { swaggerSpecs } from "../swagger";
import { initSocket } from "./socket";  
dotenv.config();

const app: Express = express();
const server = http.createServer(app);

// Initialize Socket.IO with the server
initSocket(server);

const port = process.env.PORT || 4000;

app.use(cors());  
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB connection
const mongoUri = process.env.DB_CONN_STRING || "";

mongoose
  .connect(mongoUri)
  .then(() => {
    console.log("Connected to MongoDB successfully");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err.message);
  });

// Start server
app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server");
});

server.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});

// API Documentation
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

// Available Routes
app.use("/api/auth", authRoute);
app.use("/api/interview", interviewRoute);
app.use("/api/profile", profileRoute);