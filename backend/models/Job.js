import mongoose from "mongoose";

const JobSchema = new mongoose.Schema({
  company: String,
  title: String,
  description: String,
  salary: Number
});

const Job = mongoose.model("Job", JobSchema);

export default Job;
