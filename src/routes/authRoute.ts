import { Router } from "express";
import { signup } from "../controllers/authController/signup";

const authRoute = Router();

/**
 * @swagger
 * /auth/signup:
 *   post:
 *     summary: Register a new user
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - givenName
 *               - familyName
 *             properties:
 *               email:
 *                 type: string
 *                 description: The user's email address.
 *                 example: "test105@gmail.com"
 *               password:
 *                 type: string
 *                 description: The user's password.
 *                 example: "124@124"
 *               givenName:
 *                 type: string
 *                 description: The user's given name.
 *                 example: "Test"
 *               familyName:
 *                 type: string
 *                 description: The user's family name.
 *                 example: "Mate"
 *     responses:
 *       201:
 *         description: User registered successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User registered successfully"
 *                 authorization:
 *                   type: string
 *                   description: JWT token for user authorization.
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *       400:
 *         description: Bad request, user already exists or missing fields.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Missing required fields: email, password, givenName, familyName, and occupation are required."
 *       500:
 *         description: Server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Failed to register user"
 */
authRoute.post("/signup", signup);

export default authRoute;
