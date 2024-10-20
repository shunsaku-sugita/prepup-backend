// src/queues/jobQueue.ts
import { Queue, Worker, Job } from "bullmq";
import Redis from "ioredis";
import { DefaultEventsMap, Server } from "socket.io";
import {
  generateQuestionOnOccupation,
  saveQuestionsToDatabase,
  scrapeAdzunaSection,
} from "../services/interviewQuestionsService";
import { redisConnection } from "./redisConfig";
import { getSocket } from "../socket";
import { data } from "cheerio/dist/commonjs/api/attributes";

let io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>;
const connection = redisConnection;
const jobProcessingQueue = new Queue("jobProcessing", { connection });

const jobWorker = new Worker(
  "jobProcessing",
  async (job: Job) => {
    const jobId = job.id;
    const { adzunaJobId, userId, categoryName } = job.data;
    io = getSocket();
    if (!jobId) {
      throw new Error(
        "===============================> BULLMQ JOB DOESN't EXIST <============================="
      );
    }

    getSocket()
      .to(jobId)
      .emit(jobId, { status: "Scraping job description..." });

    const jobDescription = await scrapeAdzunaSection(adzunaJobId);

    if (!jobDescription) {
      throw new Error(
        "Something went wrong while scraping job description from Adzuna. for adzuna job id " +
          adzunaJobId +
          " user id is : " +
          userId
      );
    }

    getSocket().to(jobId).emit(jobId, {
      status: "Generating questions...",
    });

    const questions: string[] | null = await generateQuestionOnOccupation(
      jobDescription
    );

    if (!questions) {
      throw new Error(
        "Something went wrong while generating question from CHATGPT, adzuna job id " +
          adzunaJobId +
          " user id is : " +
          userId
      );
    }

    getSocket()
      .to(jobId)
      .emit(jobId, {
        status: "Job processing complete!",
        statusCode: 200,
        data: questions,
      });
  },
  { connection }
);

jobWorker.on("completed", (job) => {
  console.log(
    `Job ${job.id} for Adzuna Job ID ${job.data.adzunaJobId} completed.`
  );
});

jobWorker.on("failed", (job, err) => {
  if (job) {
    console.log(
      `Job ${job.id} for Adzuna Job ID ${job.data.adzunaJobId} failed: ${err.message}`
    );

    const jobId: string | string[] | undefined = job.id;
    if (jobId) {
      io.to(jobId).emit(`jobStatus_${job.data.userId}`, {
        status: "Job failed. Please try again.",
      });
    }
  } else {
    console.log(
      "===============================> BULLMQ JOB DOESN't EXIST <============================="
    );
  }
});

export { jobProcessingQueue };
