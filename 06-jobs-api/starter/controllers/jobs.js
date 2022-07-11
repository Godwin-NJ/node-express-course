const getJobs = (req, res) => {
  res.send("get Jobs");
};
const getJob = (req, res) => {
  res.send("get single Jobs");
};
const createJobs = (req, res) => {
  res.send("create Jobs");
};
const createJob = (req, res) => {
  res.send("create job");
};
const updateJob = (req, res) => {
  res.send("update job");
};
const deleteJob = (req, res) => {
  res.send("delete job");
};

module.exports = {
  getJob,
  getJobs,
  createJob,
  createJobs,
  updateJob,
  deleteJob,
};
