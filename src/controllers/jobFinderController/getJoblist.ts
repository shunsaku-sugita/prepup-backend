import { Request, Response } from "express";
import { CustomRequest } from "../../middlewares/authMiddleware";
import User, { IUser } from "../../models/user";
import axios from "axios";
import dotenv from "dotenv";
import { format } from "date-fns";

dotenv.config();

let jobList: any[] = [];

export const searchJobs = async (req: Request, res: Response) => {
  const page = req.query.page || 1;
  const location = req.query.where || "";

  try {
    const _id = (req as CustomRequest).token.userId;
    const existingUser: IUser | null = await User.findOne({ _id });
    if (!existingUser) {
      return res.status(400).send(`User doesn't exists`);
    }

    let apiUrl = `${process.env.ADZUNA_API_URL}/${page}?app_id=${process.env.ADZUNA_API_ID}&app_key=${process.env.ADZUNA_API_KEY}&results_per_page=10&sort_by=date`;

    apiUrl += location ? `&where=${location}` : "";

    const response = await axios.get(apiUrl);

    jobList = response.data.results.map((job: any) => ({
      id: job.id,
      title: job.title,
      company: job.company.display_name,
      description: job.description,
      createdDate: format(new Date(job.created), "MMMM d, yyyy"),
      url: job.redirect_url,
    }));

    res.status(200).json(jobList);
  } catch (error) {
    res.status(400).json({ error: "Failed to fetch job list" });
  }
};

export const searchJob = (req: Request, res: Response) => {
  const { jobId } = req.params;

  const job = jobList.find((job) => job.id === jobId);

  if (!job) {
    return res.status(404).json({ message: "Job not found" });
  }

  res.json(job);
};

export const searchJobsByKeyword = async (req: Request, res: Response) => {
  const page = req.query.page || 1;
  const location = req.query.where || "";
  const keywords = req.query.keywords as string | string[] | undefined;

  const keywordQuery: string = Array.isArray(keywords)
    ? encodeURIComponent(keywords.join(" "))
    : encodeURIComponent(keywords || "");

  try {
    const _id = (req as CustomRequest).token.userId;
    const existingUser: IUser | null = await User.findOne({ _id });
    if (!existingUser) {
      return res.status(400).send(`User doesn't exist`);
    }

    let apiUrl = `${process.env.ADZUNA_API_URL}/${page}?app_id=${process.env.ADZUNA_API_ID}&app_key=${process.env.ADZUNA_API_KEY}&results_per_page=10&sort_by=date&what=${keywordQuery}`;

    apiUrl += location ? `&where=${location}` : "";

    const response = await axios.get(apiUrl);

    jobList = response.data.results.map((job: any) => ({
      id: job.id,
      title: job.title,
      company: job.company.display_name,
      description: job.description,
      createdDate: format(new Date(job.created), "MMMM d, yyyy"),
      url: job.redirect_url,
    }));

    res.status(200).json(jobList);
  } catch (error) {
    res.status(400).json({ error: "Failed to search jobs" });
  }
};
