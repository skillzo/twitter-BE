const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.ethereal.email",
  port: 587,
  secure: false, // Use `true` for port 465, `false` for all other ports
  auth: {
    user: "rickie.frami@ethereal.email",
    pass: "1r9kYaV3wcwQNRJVp9",
  },
});

module.exports = { transporter };
