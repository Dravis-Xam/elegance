import nodemailer from 'nodemailer';
import 'dotenv/config';

const transporter = nodemailer.createTransport({
  service: 'gmail', // Or another email provider
  auth: {
    user: process.env.EMAIL_USER,    // e.g., yourapp@gmail.com
    pass: process.env.EMAIL_PASS     // App password or SMTP key
  }
});

/**
 * Sends an email with given subject and message
 * @param {string} to - Recipient's email
 * @param {string} subject - Email subject
 * @param {string} message - Plain text or HTML content
 */
const sendEmail = async (to, subject, message) => {
  const mailOptions = {
    from: `"DAOGROW Support" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    text: message,         // Plain text body
    // html: message       // You can switch to HTML content if needed
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`Email sent: ${info.response}`);
    return info;
  } catch (err) {
    console.error('Email failed:', err.message);
    throw new Error('Email not sent');
  }
};

export default sendEmail;
