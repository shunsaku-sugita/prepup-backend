import { Request, Response } from "express";
import { CustomRequest } from "../../middlewares/authMiddleware";
import User from "../../models/user";
import axios from "axios";
import dotenv from "dotenv";
import { format } from "date-fns";

dotenv.config();

let jobList: any[] = [];
let jobListByKeyword: any[] = [];

// Main job search handler function
export const searchJobs = async (req: Request, res: Response) => {
  const page: number = parseInt(req.params.page);

  try {
    const apiUrl = buildApiUrl(page);
    const response = await axios.get(apiUrl);
    const jobData = response.data.results.map(formatJobDetails);

    jobList = page === 1 ? jobData : jobList.concat(jobData);

    res.status(200).json(jobList);
  } catch (error) {
    console.error("Error fetching jobs:", error);
    res.status(400).json({ error: "Failed to fetch jobs list" });
  }
};

// Job search by keyword handler function
export const searchJobsByKeyword = async (req: Request, res: Response) => {
  const page: number = parseInt(req.params.page);
  const keywords = req.query.keywords as string | string[] | undefined;

  const keywordQuery = Array.isArray(keywords)
    ? encodeURIComponent(keywords.join(" "))
    : encodeURIComponent(keywords || "");

  try {
    const apiUrl = `${process.env.ADZUNA_API_URL}/${page}?app_id=${process.env.ADZUNA_API_ID}&app_key=${process.env.ADZUNA_API_KEY}&results_per_page=10&sort_by=date&what=${keywordQuery}`;
    const response = await axios.get(apiUrl);

    jobListByKeyword = response.data.results.map(formatJobDetails);

    res.status(200).json(jobListByKeyword);
  } catch (error) {
    console.error("Error fetching jobs by keyword:", error);
    res.status(400).json({ error: "Failed to fetch jobs list" });
  }
};

// Search for a specific job by jobId
export const searchJob = (req: Request, res: Response) => {
  const { jobId } = req.params;

  const job = jobList.find((job) => job.jobId === jobId);

  if (!job) {
    return res.status(404).json({ message: "Job not found" });
  }

  res.status(200).json(job);
};

// Bookmark a job
export const bookmarkJob = async (req: Request, res: Response) => {
  const bookmarkedJob = getJobDetails(req);
  const userId = (req as CustomRequest).token.userId;

  try {
    const existingJob = await isJobBookmarked(userId, bookmarkedJob.jobId);

    if (existingJob) {
      return res.status(400).json({ error: "Job already bookmarked" });
    }

    const updatedUser = await bookmarkJobForUser(userId, bookmarkedJob);

    res.status(200).json(bookmarkedJob);
  } catch (error) {
    console.error("Error bookmarking job:", error);
    res.status(500).json({ error: "Failed to bookmark job" });
  }
};

// Unbookmark a job
export const unbookmarkJob = async (req: Request, res: Response) => {
  const jobId = req.params.jobId;
  const userId = (req as CustomRequest).token.userId;

  try {
    const existingJob = await isJobBookmarked(userId, jobId);

    if (!existingJob) {
      return res.status(404).json({ error: "Job not found in bookmarks" });
    }

    const updatedUser = await unbookmarkJobForUser(userId, jobId);

    res.status(200).json({ message: "Job unbookmarked successfully" });
  } catch (error) {
    console.error("Error unbookmarking job:", error);
    res.status(500).json({ error: "Failed to unbookmark job" });
  }
};

// Get bookmarked jobs for a user
export const getBookmarkedJobs = async (req: Request, res: Response) => {
  const userId = (req as CustomRequest).token.userId;

  try {
    // Find the user by their ID and select only the savedJobs field
    const bookmarkedJobs = await User.findById(userId).select("savedJobs");
    if (!bookmarkedJobs) {
      return res.status(404).json({ error: "User not found" });
    }

    // Check if savedJobs array is empty
    if (bookmarkedJobs.savedJobs.length === 0) {
      return res.status(200).json({ message: "No jobs bookmarked" });
    }

    res.status(200).json(bookmarkedJobs.savedJobs);
  } catch (error) {
    console.error("Error fetching bookmarked jobs:", error);
    res.status(500).json({ error: "Failed to fetch bookmarked jobs" });
  }
};

// Utility function to build the API URL
const buildApiUrl = (page: number) => {
  return `${process.env.ADZUNA_API_URL}/${page}?app_id=${process.env.ADZUNA_API_ID}&app_key=${process.env.ADZUNA_API_KEY}&results_per_page=10&sort_by=date`;
};

// Utility function to format job details
const formatJobDetails = (job: any) => ({
  jobId: String(job.id),
  title: String(job.title),
  company: String(job.company.display_name),
  companyInitial: String(job.company.display_name.charAt(0).toUpperCase()),
  description: String(job.description),
  createdDate: String(format(new Date(job.created), "MMMM d, yyyy")),
  url: String(job.redirect_url),
});

// Utility function to extract job data from the request
const getJobDetails = (req: Request) => ({
  jobId: req.body.jobId,
  title: req.body.title,
  company: req.body.company,
  companyInitial: req.body.companyInitial,
  description: req.body.description,
  createdDate: req.body.createdDate,
  url: req.body.url,
});

// Utility function to check if the job is already bookmarked
const isJobBookmarked = async (userId: string, jobId: string) => {
  return await User.findOne({
    _id: userId,
    savedJobs: { $elemMatch: { jobId } },
  });
};

// Utility function to bookmark the job
const bookmarkJobForUser = async (userId: string, jobDetails: object) => {
  return await User.findOneAndUpdate(
    { _id: userId },
    { $push: { savedJobs: jobDetails } },
    { new: true }
  );
};

// Utility function to unbookmark the job
const unbookmarkJobForUser = async (userId: string, jobId: string) => {
  return await User.findOneAndUpdate(
    { _id: userId },
    { $pull: { savedJobs: { jobId } } },
    { new: true }
  );
};
