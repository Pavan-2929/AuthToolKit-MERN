import nodemailer from "nodemailer";

const magicLinkMailer = async ({ email, magicLinkToken }) => {
  const url = process.env.FRONTEND_URL;
  const magicLink = `${url}/signin/magic-link/${magicLinkToken}`;

  try {
    let transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: parseInt(process.env.MAIL_PORT, 10),
      secure: false,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.NODE_PASS,
      },
    });

    let htmlMessage = `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <h2 style="color: #007BFF;">Login to CasePanda Instantly</h2>
        <p>Click the link below to securely login to your account:</p>
        <a href="${magicLink}" style="font-size: 1.5em; font-weight: bold; color: #444;">Login with Magic Link</a>
        <p>This link is valid for 15 minutes and can be used only once.</p>
        <p>Best regards,<br/>The CasePanda Team</p>
      </div>
    `;

    let info = await transporter.sendMail({
      from: `"CasePanda" <${process.env.NODE_EMAIL}>`,
      to: email,
      subject: "CasePanda | Your Magic Login Link",
      html: htmlMessage,
    });

    return info;
  } catch (error) {
    console.error("Error sending magic link email:", error);
    throw error;
  }
};

export default magicLinkMailer;
