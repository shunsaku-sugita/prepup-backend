import { Router } from "express";
import {
  category,
  createCategory,
} from "../controllers/interviewController/category";
import { userVerification } from "../middlewares/authMiddleware";
import { generateQuestions } from "../controllers/interviewController/generateQuestions";
import { analyzeAnswers } from "../controllers/interviewController/analyzeAnswers";

const interviewRoute = Router();

/**
 * @swagger
 * /interview/category:
 *   get:
 *     summary: Get interview category for the authenticated user.
 *     tags:
 *       - Interview
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Interview category data for the user.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 occupation:
 *                   type: boolean
 *                   description: Indicates if the user has an occupation.
 *                   example: true
 *                 category:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: integer
 *                         description: The category ID.
 *                         example: 0
 *                       categoryName:
 *                         type: string
 *                         description: The name of the interview category.
 *                         example: "Android Engineer"
 *                       questions:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             _id:
 *                               type: integer
 *                               description: The question ID.
 *                               example: 0
 *                             question:
 *                               type: string
 *                               description: The interview question.
 *                               example: "What inspired you to become an Android engineer?"
 *                             audio:
 *                               type: string
 *                               description: Audio recording URL of the question.
 *                               example: ""
 *                             transcript:
 *                               type: string
 *                               description: Transcript of the audio recording.
 *                               example: ""
 *                             answer:
 *                               type: string
 *                               description: Answer provided by the user.
 *                               example: ""
 *                       badge:
 *                         type: string
 *                         description: Badge associated with the interview category.
 *                         example: ""
 *                       score:
 *                         type: array
 *                         description: Scores associated with the category.
 *                         items:
 *                           type: object
 *       400:
 *         description: Bad request or user does not exist.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "User doesn't exist"
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
 *       500:
 *         description: Server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Failed to retrieve interview category"
 */
interviewRoute.get("/category", userVerification, category);
interviewRoute.post("/generate-questions", userVerification, generateQuestions);
interviewRoute.post("/analyze-answers", userVerification, analyzeAnswers);
interviewRoute.post("/category", userVerification, createCategory);

export default interviewRoute;
