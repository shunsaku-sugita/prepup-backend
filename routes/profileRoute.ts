
import { Router } from "express";
import { userVerification } from "../middlewares/authMiddleware";
import { getProfile } from "../controllers/profileController/getProfile";
import { updateProfile } from "../controllers/profileController/updateProfile";

const profileRoute = Router();

profileRoute.get('/', userVerification, getProfile);
profileRoute.put('/', userVerification, updateProfile);

export default profileRoute;