const nodemailer = require("nodemailer");
const sgMail = require("@sendgrid/mail");

const sendEmailEthereal = async (req, res) => {
  //   let testAccount = await nodemailer.createTestAccount();
  const transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    auth: {
      user: "branson.hickle66@ethereal.email",
      pass: "4qj97TMZzuF34bBdTv",
    },
  });

  let info = await transporter.sendMail({
    from: "amadigodwin7@gmail.com",
    to: "amadigodwin7@gmail.com",
    subject: "sending email using nodemailer test account",
    html: "<h2>Hi Godwin, this the body of your email</h2>",
  });
  res.json(info);
};

const sendEmail = async (req, res) => {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  const msg = {
    to: "amadigodwin7@gmail.com", // Change to your recipient
    from: "amadigodwin7@gmail.com", // Change to your verified sender
    subject: "Sending with SendGrid is Fun",
    text: "and easy to do anywhere, even with Node.js",
    html: "<strong>and easy to do anywhere, even with Node.js</strong>",
  };
  const info = await sgMail.send(msg);
  res.json(info);
};

module.exports = sendEmail;
