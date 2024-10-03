import { signup } from "../controllers/authController";
import { Router } from "express";

const authRoute = Router();

authRoute.post('/signup', signup);

export default authRoute;