// server/utils/sendEmail.js
// In dev we just console.log. Replace with nodemailer/SendGrid in prod.
module.exports = async function sendEmail({ to, subject, text }) {
    console.log(`\n🚀 Sending email to ${to} — subject: ${subject}`);
    console.log(text, '\n');
  };
  