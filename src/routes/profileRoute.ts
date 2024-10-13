
import { Router } from "express";
import { userVerification } from "../middlewares/authMiddleware";
import { getProfile } from "../controllers/profileController/getProfile";
import { updateProfile } from "../controllers/profileController/updateProfile";

const profileRoute = Router();

/**
 * @swagger
 * /profile:
 *   get:
 *     summary: Get the user's profile
 *     tags:
 *       - Profile
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Returns the user's profile details.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     email:
 *                       type: string
 *                     givenName:
 *                       type: string
 *                     familyName:
 *                       type: string
 *                     occupation:
 *                       type: string
 *       401:
 *         description: Unauthorized request.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "User token expired"
 *                 error:
 *                   type: string
 *                   example: "Invalid token"
 *       400:
 *         description: Bad request.
 */
profileRoute.get('/', userVerification, getProfile);

/**
 * @swagger
 * /profile:
 *   put:
 *     summary: Update the user's profile
 *     tags:
 *       - Profile
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               givenName:
 *                 type: string
 *               familyName:
 *                 type: string
 *               occupation:
 *                 type: string
 *             example:
 *               givenName: "Test"
 *               familyName: "Mate"
 *               occupation: "Android Engineer"
 *     responses:
 *       200:
 *         description: Profile updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 updatedFields:
 *                   type: object
 *                   properties:
 *                     givenName:
 *                       type: string
 *                     familyName:
 *                       type: string
 *                     occupation:
 *                       type: string
 *                 message:
 *                   type: string
 *                   example: "Profile updated successfully"
 *       400:
 *         description: No valid fields to update or bad request.
 *       401:
 *         description: Unauthorized request.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "User token expired"
 *                 error:
 *                   type: string
 *                   example: "Invalid token"
 */
profileRoute.put('/', userVerification, updateProfile);

export default profileRoute;