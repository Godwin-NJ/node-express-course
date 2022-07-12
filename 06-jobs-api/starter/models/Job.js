const mongoose = require("mongoose");
const { Schema } = mongoose;

const jobSchema = new Schema({});

module.exports = mongoose.model("Job", jobSchema);
