const Job = require("../models/Job");
const { StatusCodes } = require("http-status-codes");
const { NotFoundError, BadRequestError } = require("../errors");
// const { json } = require("express");

const getJobs = async (req, res) => {
  const jobs = await Job.find({ createdBy: req.user.UserId }).sort("createdAt");
  res.status(StatusCodes.OK).json({ jobs, count: jobs.length });
};
const getJob = async (req, res) => {
  const {
    user: { UserId },
    params: { id: jobId },
  } = req;
  const job = await Job.findById({ _id: jobId, createdBy: UserId });
  if (!job) {
    throw new NotFoundError("Job does not exist");
  }
  res.status(StatusCodes.OK).json({ job });
};
// const createJobs = (req, res) => {
//   res.json(req.user);
// };
const createJob = async (req, res) => {
  // console.log(req.user, "req.user");
  req.body.createdBy = req.user.UserId;
  const newJob = await Job.create(req.body);
  res.status(StatusCodes.CREATED).json({ newJob });
};
const updateJob = async (req, res) => {
  const {
    body: { company, position },
    user: { UserId },
    params: { id: jobId },
  } = req;
  if (company === "" || position === "") {
    throw new BadRequestError("company or position fields cannot be empty");
  }
  const newJob = await Job.findOneAndUpdate(
    { _id: jobId, createdBy: UserId },
    req.body,
    { new: true, runValidators: true }
  );
  res.status(StatusCodes.OK).json({ newJob });
};
const deleteJob = async (req, res) => {
  const {
    user: { UserId },
    params: { id: jobId },
  } = req;
  const deletedJob = await Job.findOneAndDelete({
    _id: jobId,
    createdBy: UserId,
  });
  if (!deletedJob) {
    throw new BadRequestError(`No job with id : ${jobId}`);
  }
  res.status(StatusCodes.OK).send();
};

module.exports = {
  getJob,
  getJobs,
  createJob,
  // createJobs,
  updateJob,
  deleteJob,
};
