import { Router } from "express";
import {
  getQuestion,
  analyzeAnswers,
} from "../controllers/starMasterController/starMasterController";
import { userVerification } from "../middlewares/authMiddleware";

const starMasterRoute = Router();

/**
 * @swagger
 *   /question:
 *     get:
 *       summary: Fetch a random question from the question bank
 *       description: Retrieves a random question from the stored STAR method question bank.
 *       responses:
 *         '200':
 *           description: Successfully fetched a random question
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     description: The unique identifier for the question
 *                   question:
 *                     type: string
 *                     description: The text of the question
 *         '400':
 *           description: No question found
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     example: No question found
 *         '500':
 *           description: Internal server error
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     example: Error fetching question
 *   /analyze:
 *     post:
 *       summary: Analyze user-provided STAR method answers
 *       description: Analyzes the STAR answers provided by the user for a specific question.
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 question:
 *                   type: string
 *                   description: The question being answered
 *                 answers:
 *                   type: string
 *                   description: The user's STAR method answer
 *               required:
 *                 - question
 *                 - answers
 *       responses:
 *         '200':
 *           description: Successfully analyzed the answers
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   feedback:
 *                     type: string
 *                     description: Feedback for the provided answers
 *                   score:
 *                     type: number
 *                     description: Score for the provided answers
 *         '400':
 *           description: Question or answers not provided
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   error:
 *                     type: string
 *                     example: Question or answers not provided
 *         '500':
 *           description: Failed to analyze answers
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   error:
 *                     type: string
 *                     example: Failed to analyze answers
 */

starMasterRoute.get("/question", userVerification, getQuestion);
starMasterRoute.post("/analyze", userVerification, analyzeAnswers);

export default starMasterRoute;
