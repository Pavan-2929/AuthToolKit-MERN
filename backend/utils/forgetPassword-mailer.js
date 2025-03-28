import nodemailer from "nodemailer";

const forgetPassworMailer = async ({ email, resetPasswordToken }) => {
  const url = process.env.FRONTEND_URL;

  const resetLink = `${url}/signin/reset-password/${resetPasswordToken}`;
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
        <h2 style="color: #007BFF;">Reset Your CasePanda Password</h2>
        <p>We received a request to reset your password.</p>
        <p>Click the link below to set a new password:</p>
        <a href="${resetLink}" style="font-size: 1.5em; font-weight: bold; color: #444;">Reset Password</a>
        <p>Best regards,<br/>The CasePanda Team</p>
      </div>
`;

    let info = await transporter.sendMail({
      from: `"CasePanda" <${process.env.NODE_EMAIL}>`,
      to: email,
      subject: "CasePanda | Verification Code",
      html: htmlMessage,
    });

    return info;
  } catch (error) {
    console.error("Error sending verification email:", error);
    throw error;
  }
};

export default forgetPassworMailer;
