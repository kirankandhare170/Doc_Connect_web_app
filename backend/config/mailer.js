// config/mailer.js
// Uses sib-api-v3-sdk (Brevo / Sendinblue transactional emails)
const SibApiV3Sdk = require('sib-api-v3-sdk');
require('dotenv').config();

const client = SibApiV3Sdk.ApiClient.instance;
if (!process.env.BREVO_API_KEY) {
  console.warn('Warning: BREVO_API_KEY not set in env');
}
client.authentications['api-key'].apiKey = process.env.BREVO_API_KEY;

const emailApi = new SibApiV3Sdk.TransactionalEmailsApi();

/**
 * sendMail - generic transactional email sender
 * options: { from: {email, name}, to: [{email, name}], subject, htmlContent, textContent, replyTo }
 */
async function sendMail(options = {}) {
  const payload = {
    sender: options.from || { email: process.env.SENDER_EMAIL || process.env.SMTP_SENDER, name: process.env.SENDER_NAME || 'Doc Connect' },
    to: Array.isArray(options.to) ? options.to : [{ email: options.to }],
    subject: options.subject || 'No Subject',
    htmlContent: options.htmlContent || options.html || '',
    textContent: options.textContent || options.text || undefined,
    replyTo: options.replyTo ? { email: options.replyTo } : undefined,
  };

  try {
    const response = await emailApi.sendTransacEmail(payload);
    return response;
  } catch (err) {
    // normalize error
    if (err && err.response && err.response.body) {
      const body = err.response.body;
      throw new Error(body.message || JSON.stringify(body));
    }
    throw err;
  }
}

/**
 * sendOTP - convenience for OTP emails
 */
async function sendOTP(toEmail, otp, name = '') {
  const html = `
    <h2>Hello ${name || ''}</h2>
    <p>Your verification OTP is:</p>
    <h1>${otp}</h1>
    <p>This OTP is valid for a limited time.</p>
  `;
  return sendMail({
    to: [{ email: toEmail }],
    subject: 'Your Verification OTP',
    htmlContent: html,
  });
}

async function sendContact({ fromEmail, name, message, toEmail }) {
  return sendMail({
    from: {
      email: process.env.SMTP_SENDER,  // Verified Brevo sender
      name: "Doc Connect Contact Form"
    },
    to: [{ email: toEmail }],          // Admin email
    replyTo: fromEmail,                // User's email
    subject: `New Contact Message from ${name}`,
    htmlContent: `
      <h2>New Contact Message</h2>
      <p><b>Name:</b> ${name}</p>
      <p><b>Email:</b> ${fromEmail}</p>
      <p><b>Message:</b></p>
      <p>${message}</p>
    `,
    textContent: `Name: ${name}\nEmail: ${fromEmail}\nMessage: ${message}`,
  });
}

// Send appointment status email
async function sendAppointmentStatusMail({ toEmail, subject, html, text }) {
  return sendMail({
    to: [{ email: toEmail }],
    subject,
    htmlContent: html,
    textContent: text,
    from: {
      email: process.env.SMTP_SENDER,
      name: "DocConnect",
    },
  });
}

module.exports = {
  sendMail,
  sendOTP,
  sendContact,
  sendAppointmentStatusMail,
};
