import nodemailer from "nodemailer";

const verificationCodeMailer = async ({
  username,
  email,
  verificationCode,
}) => {
  try {
    console.log(email, username, verificationCode);

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
    <h2 style="color: #007BFF;">Welcome to CasePanda, ${username}!</h2>
    <p>Thank you for signing up. To complete your registration, please use the verification code below:</p>
    <p style="font-size: 1.5em; font-weight: bold; color: #444;">${verificationCode}</p>
    <p>If you did not sign up for this account, please ignore this email.</p>
    <p>Best regards,<br/>The CasePanda Team</p>
  </div>
`;

    let info = await transporter.sendMail({
      from: `"CasePanda" <${process.env.NODE_EMAIL}>`,
      to: email,
      subject: "CasePanda | Verification Code",
      html: htmlMessage,
    });

    return { message: "OTP Sent succssfully" };
  } catch (error) {
    console.error("Error sending verification email:", error);
    throw error;
  }
};

export default verificationCodeMailer;
