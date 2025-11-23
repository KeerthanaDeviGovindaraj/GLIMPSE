import Job from "../models/Job.js";

export async function createJob(req, res) {
  try {
    const job = new Job(req.body);
    await job.save();
    return res.json({ message: "Job created successfully" });
  } catch (err) {
    return res.status(500).json({ error: "Server error" });
  }
}

export async function getJobs(req, res) {
  try {
    const jobs = await Job.find();
    return res.json(jobs);
  } catch (err) {
    return res.status(500).json({ error: "Server error" });
  }
}
