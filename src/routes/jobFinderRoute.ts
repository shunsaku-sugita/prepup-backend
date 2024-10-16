import { Router } from "express";
import {
  searchJobs,
  searchJobsByKeyword,
  searchJob,
} from "../controllers/jobFinderController/getJoblist";
import { userVerification } from "../middlewares/authMiddleware";

const jobFinderRoute = Router();

jobFinderRoute.get("/jobs", userVerification, searchJobs);
jobFinderRoute.get("/jobs/keyword", userVerification, searchJobsByKeyword);
jobFinderRoute.get("/jobs/:jobId", userVerification, searchJob);

export default jobFinderRoute;
