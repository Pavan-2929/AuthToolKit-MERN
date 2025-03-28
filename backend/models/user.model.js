import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: false,
      select: false,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    avatarUrl: String,
    verificationCode: Number,
    verificationCodeExpire: Date,
    resetPasswordToken: String,
    resetPasswordTokenExpire: Date,
    magicLinkToken: String,
    magicLinkTokenExpire: Date,
  },
  { timestamps: true }
);

userSchema.methods.comparePassword = async function (userPassword) {
  return await bcrypt.compare(userPassword, this.password);
};

userSchema.methods.generateToken = async function () {
  try {
    return jwt.sign(
      {
        id: this._id,
      },
      process.env.JWT_SECRET_KEY,
      {
        expiresIn: "30d",
      }
    );
  } catch (error) {
    console.error(error);
  }
};

userSchema.methods.generateResetPasswordToken = async function () {
  const resetPasswordToken = crypto.randomBytes(20).toString("hex");

  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetPasswordToken)
    .digest("hex");

  this.resetPasswordTokenExpire = new Date(Date.now() + 10 * 60 * 1000);

  return resetPasswordToken;
};

userSchema.methods.generateMagicLinkToken = async function () {
  const magicLinkToken = crypto.randomBytes(20).toString("hex");

  this.magicLinkToken = crypto
    .createHash("sha256")
    .update(magicLinkToken)
    .digest("hex");
  this.magicLinkTokenExpire = new Date(Date.now() + 10 * 60 * 1000);

  return magicLinkToken;
};

export const User = mongoose.model("User", userSchema);
