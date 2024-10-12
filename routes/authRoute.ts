
import { Router } from "express";
import { signup } from "../controllers/authController/signup"

const authRoute = Router();

authRoute.post('/signup', signup);

export default authRoute;