const getJobs = (req, res) => {
  res.send("get Jobs");
};
const getJob = (req, res) => {
  res.send("get single Jobs");
};
// const createJobs = (req, res) => {
//   res.json(req.user);
// };
const createJob = (req, res) => {
  res.json(req.user);
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
  // createJobs,
  updateJob,
  deleteJob,
};
