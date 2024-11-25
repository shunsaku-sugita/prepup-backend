import { Router } from "express";
import {
  searchJobs,
  searchJobsByKeyword,
  bookmarkJob,
  unbookmarkJob,
  getBookmarkedJobs,
} from "../controllers/jobFinderController/getJoblist";
import { userVerification } from "../middlewares/authMiddleware";

const jobFinderRoute = Router();

/**
 * @swagger
 * /jobs/{page}:
 *   get:
 *     summary: Get jobs list
 *     tags: [Job Finder]
 *     parameters:
 *       - in: path
 *         name: page
 *         required: true
 *         schema:
 *           type: integer
 *         description: The page number of the job list
 *     responses:
 *       200:
 *         description: Successful response with a list of jobs
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   jobId:
 *                     type: string
 *                   title:
 *                     type: string
 *                   company:
 *                     type: string
 *                   description:
 *                     type: string
 *                   createdDate:
 *                     type: string
 *                     format: date
 *                   url:
 *                     type: string
 *                   isBookmarked:
 *                     type: boolean
 *       400:
 *         description: Failed to fetch jobs
 */
/**
 * @swagger
 * /jobs/keywords/{page}:
 *   get:
 *     summary: Search jobs by keyword
 *     tags: [Job Finder]
 *     parameters:
 *       - in: path
 *         name: page
 *         required: true
 *         schema:
 *           type: integer
 *         description: The page number of the job list
 *       - in: query
 *         name: keywords
 *         required: false
 *         schema:
 *           type: string
 *         description: Keywords for job search
 *     responses:
 *       200:
 *         description: Successful response with a list of jobs matching the keyword
 *       400:
 *         description: Failed to fetch jobs
 */
/**
 * @swagger
 * /jobs/bookmark:
 *   post:
 *     summary: Bookmark a job
 *     tags: [Jobs]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               jobId:
 *                 type: string
 *               title:
 *                 type: string
 *               company:
 *                 type: string
 *               description:
 *                 type: string
 *               createdDate:
 *                 type: string
 *                 format: date
 *               url:
 *                 type: string
 *     responses:
 *       200:
 *         description: Job bookmarked successfully
 *       400:
 *         description: Job already bookmarked
 *       500:
 *         description: Failed to bookmark job
 */
/**
 * @swagger
 * /jobs/bookmark/{jobId}:
 *   delete:
 *     summary: Unbookmark a job
 *     tags: [Jobs]
 *     parameters:
 *       - in: path
 *         name: jobId
 *         required: true
 *         schema:
 *           type: string
 *         description: The job ID to unbookmark
 *     responses:
 *       200:
 *         description: Job unbookmarked successfully
 *       404:
 *         description: Job not found in bookmarks
 *       500:
 *         description: Failed to unbookmark job
 */
/**
 * @swagger
 * /jobs/bookmarked:
 *   get:
 *     summary: Get all bookmarked jobs
 *     tags: [Jobs]
 *     responses:
 *       200:
 *         description: Successful response with a list of bookmarked jobs
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   jobId:
 *                     type: string
 *                   title:
 *                     type: string
 *                   company:
 *                     type: string
 *                   description:
 *                     type: string
 *                   createdDate:
 *                     type: string
 *                     format: date
 *                   url:
 *                     type: string
 *       404:
 *         description: No bookmarked jobs found
 *       500:
 *         description: Failed to fetch bookmarked jobs
 */

jobFinderRoute.get("/search/:page", userVerification, searchJobs);
jobFinderRoute.get(
  "/search/keyword/:page",
  userVerification,
  searchJobsByKeyword
);
jobFinderRoute.get("/bookmarked", userVerification, getBookmarkedJobs);
jobFinderRoute.post("/bookmark", userVerification, bookmarkJob);
jobFinderRoute.delete("/bookmark/:jobId", userVerification, unbookmarkJob);

export default jobFinderRoute;
