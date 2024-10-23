import { Router } from "express";
import {
  getQuestion,
  analyzeAnswers,
} from "../controllers/starMasterController/starMasterController";
import { userVerification } from "../middlewares/authMiddleware";

const starMasterRoute = Router();

starMasterRoute.get("/question", userVerification, getQuestion);
starMasterRoute.post("/analyze", userVerification, analyzeAnswers);

export default starMasterRoute;
