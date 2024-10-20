import { Router } from "express";
import {
  searchJobs,
  searchJobsByKeyword,
  searchJob,
  bookmarkJob,
  unbookmarkJob,
  getBookmarkedJobs,
} from "../controllers/jobFinderController/getJoblist";
import { userVerification } from "../middlewares/authMiddleware";

const jobFinderRoute = Router();

jobFinderRoute.get("/search/:page", userVerification, searchJobs);
jobFinderRoute.get(
  "/search/keyword/:page",
  userVerification,
  searchJobsByKeyword
);
jobFinderRoute.get("/jobs/:jobId", userVerification, searchJob);
jobFinderRoute.get("/bookmarked", userVerification, getBookmarkedJobs);
jobFinderRoute.post("/bookmark", userVerification, bookmarkJob);
jobFinderRoute.delete("/bookmark/:jobId", userVerification, unbookmarkJob);

export default jobFinderRoute;
