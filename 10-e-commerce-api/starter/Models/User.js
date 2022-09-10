const mongoose = require("mongoose");
const { Schema } = mongoose;
const validator = require("validator");
const bcrypt = require("bcryptjs");

const UserSchema = new Schema({
  name: {
    type: "String",
    required: [true, "Please provide name"],
    min: 3,
    max: 50,
  },
  email: {
    type: "String",
    required: [true, "Please provide email"],
    validate: {
      validator: validator.isEmail,
      message: "Please provide valid email address",
    },
  },
  password: {
    type: "String",
    required: [true, "Please provide email"],
    min: 6,
    max: 50,
  },
  role: {
    type: String,
    enum: ["admin", "user"],
    default: "user",
  },
});

UserSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

UserSchema.methods.comparePassword = async function (pwd) {
  const isMatch = await bcrypt.compare(pwd, this.password);
  return isMatch;
};

module.exports = mongoose.model("User", UserSchema);
