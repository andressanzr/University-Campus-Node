const nodemailer = require("nodemailer");
const mailCredentials = require("../credentials/gmail");

var transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: mailCredentials.emailAddress,
    pass: mailCredentials.pass
  }
});

module.exports = {
  sendEmail: (destinatary, subject, text) => {
    var mailOptions = {
      from: mailCredentials.emailAddress,
      to: destinatary,
      subject: subject,
      html: text
    };
    transporter.sendMail(mailOptions, (err, info) => {
      err ? console.log(err) : console.log(info);
    });
    console.log("test email");
  }
};
