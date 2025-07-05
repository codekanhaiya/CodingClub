const express = require("express");
const nodemailer = require("nodemailer");

const router = express.Router();

router.post("/send-email", async (req, res) => {
  const { to, subject, content } = req.body;

  if (!to || !subject || !content) {
    return res.status(400).json({
      message: "All fields are required (to, subject, content)",
    });
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "kanhaiyaguptaksg@gmail.com", // Your FROM Email ID
      pass: "gxhy gzuh bohh zywr",   // Get from here:  https://myaccount.google.com/apppasswords
    },
  });

  const mailOptions = {
    from: "kanhaiyalaptop123@gmail.com", // fixed and safe
    to,
    subject,
    text: content,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: "Email sent successfully!" });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ message: "Failed to send email." });
  }
});

module.exports = router;
