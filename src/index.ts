import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import * as mongoDB from "mongodb";
import { error } from "console";
import authRoute from "../routes/authRoute";
import mongoose from 'mongoose';
import interviewRoute from "../routes/interviewRoute";
import profileRoute from "../routes/profileRoute";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 4000;

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//------------------------Connect to mongoDb Database--------------------------------


const mongoUri = process.env.DB_CONN_STRING || "";

// Connect to MongoDB
mongoose.connect(mongoUri)
.then(() => {
  console.log('Connected to MongoDB successfully');
})
.catch((err) => {
  console.error('Error connecting to MongoDB:', err.message);
});
//--------------------------End of mongoDB database Connection-------------------------


//------------------------------Starting Server-----------------------------------------
app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server");
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
//--------------------------End Of Starting Server--------------------------------------


// --------------------------------Available Routes--------------------------------------
app.use("/api/auth", authRoute);
app.use("/api/interview", interviewRoute);
app.use("/api/profile", profileRoute )