import errorHandler from "../middleware/errorHandler.js";
import { User } from "../models/user.model.js";
import bcrypt from "bcrypt";
import verificationCodeMailer from "../utils/verificationCode-mailer.js";
import forgetPassworMailer from "../utils/forgetPassword-mailer.js";
import crypto from "crypto";
import magicLinkMailer from "../utils/magicLink-mailer.js";

export const registerController = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return next(errorHandler(400, "All fields are required."));
    }

    const isUserVerified = await User.findOne({
      email,
      isVerified: true,
    });

    if (isUserVerified) {
      return next(errorHandler(400, "User is already verified, Please Login."));
    }

    const user = await User.findOne({ email });
    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationCode = Math.floor(Math.random() * 9000 + 1000);
    const verificationCodeExpire = new Date(Date.now() + 10 * 60 * 1000);

    if (user) {
      user.username = username;
      user.password = hashedPassword;
      user.verificationCode = verificationCode;
      user.verificationCodeExpire = verificationCodeExpire;

      await user.save();
    } else {
      const newUser = new User({
        username,
        email,
        password: hashedPassword,
        verificationCode,
        verificationCodeExpire,
      });
      await newUser.save();
    }

    await verificationCodeMailer({ username, email, verificationCode });

    return res.status(200).json({
      success: true,
      message: "OTP sent successfully",
    });
  } catch (error) {
    console.error("Error in register", error);
    next(error);
  }
};

export const verifyCode = async (req, res, next) => {
  try {
    const { email, verificationCode } = req.body;

    const existingUser = await User.findOne({
      email,
    });

    if (!existingUser) {
      return next(errorHandler(404, "User not found."));
    }

    const isVerificationCodeValid =
      Number(verificationCode) === Number(existingUser.verificationCode);
    const isVerificationCodeExpire =
      new Date() > existingUser.verificationCodeExpire;

    if (isVerificationCodeValid && !isVerificationCodeExpire) {
      existingUser.isVerified = true;
      await existingUser.save();

      const token = await existingUser.generateToken();
      const expiryTime = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

      res.cookie("token", token, {
        expires: expiryTime,
        sameSite: "None",
        secure: true,
      });

      res.status(200).json({
        success: true,
        message: "Login Successful.",
        data: existingUser,
      });
    } else {
      existingUser.isVerified = false;
      await existingUser.save();

      return next(errorHandler(401, "Invalid Verification Code"));
    }
  } catch (error) {
    console.error("Error in Verification");
    next(error);
  }
};

export const loginController = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    console.log(email, password);

    if (!email || !password) {
      return next(errorHandler(400, "All fields are required."));
    }

    const user = await User.findOne({
      email,
      isVerified: true,
    }).select("+password");

    if (!user) {
      return next(errorHandler(404, "User not found."));
    }

    const isPasswordValid = await user.comparePassword(password);
    console.log(isPasswordValid);

    if (!isPasswordValid) {
      return next(errorHandler(400, "Wrong credentials."));
    }

    const token = await user.generateToken();
    const expiryTime = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

    res.cookie("token", token, {
      expires: expiryTime,
      sameSite: "None",
      secure: true,
    });

    res.status(200).json({
      success: true,
      message: "Login Successful.",
      data: user,
    });
  } catch (error) {
    console.error("Error in login", error);
    next(error);
  }
};

export const logoutController = async (req, res, next) => {
  try {
    res
      .status(200)
      .cookie("token", "", {
        expires: new Date(Date.now()),
      })
      .json({
        success: true,
        message: "Logout successfully.",
      });
  } catch (error) {
    console.error("Error in logout", error);
    next(error);
  }
};

export const forgetPasswordController = async (req, res, next) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({
      email,
      isVerified: true,
    });

    if (!user) {
      return next(errorHandler(404, "User not found."));
    }

    const resetPasswordToken = await user.generateResetPasswordToken();
    await user.save();

    await forgetPassworMailer({ email, resetPasswordToken });

    return res.status(200).json({
      success: true,
      message: "Reset password link sent successfully.",
    });
  } catch (error) {
    next(error);
  }
};

export const resetPasswordController = async (req, res, next) => {
  try {
    const { token } = req.params;

    if (!token) {
      return next(errorHandler(400, "Token is required."));
    }

    const resetPasswordToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordTokenExpire: {
        $gt: new Date(Date.now()),
      },
    });

    if (!user) {
      return next(errorHandler(400, "Reset Password token is invalid."));
    }

    const { password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordTokenExpire = undefined;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Password is changed, Please Login",
    });
  } catch (error) {
    console.error("Error in reset-password", error);
    next(error);
  }
};

export const googleLoginController = async (req, res, next) => {
  try {
    const { username, email, avatarUrl } = req.body;

    const user = await User.findOne({
      email,
    });

    if (user) {
      const { password, ...reset } = user._doc;

      const token = await user.generateToken();
      const expiryTime = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

      res.cookie("token", token, {
        expires: expiryTime,
        sameSite: "None",
        secure: true,
      });

      res.status(200).json({
        success: true,
        message: "Login Successful.",
        data: reset,
      });
    } else {
      const newUser = await User.create({
        username,
        email,
        avatarUrl,
        isVerified: true,
      });

      const token = await newUser.generateToken();
      const expiryTime = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

      res.cookie("token", token, {
        expires: expiryTime,
        sameSite: "None",
        secure: true,
      });

      res.status(200).json({
        success: true,
        message: "Login Successful.",
        data: newUser,
      });
    }
  } catch (error) {
    console.error("Error in google-login", error);
    next(error);
  }
};

export const magicLinkController = async (req, res, next) => {
  try {
    const { email } = req.body;

    const username = email.replace("@gmail.com", "");

    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        username,
        email,
        isVerified: true,
      });
    }

    const magicLinkToken = await user.generateMagicLinkToken();
    console.log(magicLinkToken);

    await user.save();

    await magicLinkMailer({ email, magicLinkToken });

    return res.status(200).json({
      success: true,
      message: "Magic Link sent successfully.",
    });
  } catch (error) {
    console.error("Error in magic link", error);
    next(error);
  }
};

export const verifyMagicLink = async (req, res, next) => {
  try {
    const { token } = req.params;

    console.log(token);

    if (!token) {
      return next(errorHandler(400, "Token is required."));
    }

    const magicLinkToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    const user = await User.findOne({
      magicLinkToken,
      magicLinkTokenExpire: {
        $gt: new Date(Date.now()),
      },
    });

    if (!user) {
      return next(errorHandler(400, "Magic Link token is invalid."));
    }

    await user.updateOne({
      isVerified: true,
    });

    const { password, ...reset } = user._doc;

    const JWTtoken = await user.generateToken();
    const expiryTime = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

    res.cookie("token", JWTtoken, {
      expires: expiryTime,
      sameSite: "None",
      secure: true,
    });

    res.status(200).json({
      success: true,
      message: "Login Successful.",
      data: reset,
    });
  } catch (error) {
    console.error("Error in verify magic link", error);
    next(error);
  }
};
