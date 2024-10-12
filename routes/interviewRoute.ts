
import { Router } from "express";
import { category } from "../controllers/interviewController/category";
import { userVerification } from "../middlewares/authMiddleware";

const interviewRoute = Router();

interviewRoute.get('/category', userVerification, category);

export default interviewRoute;