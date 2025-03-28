import cloudinary from "../config/cloudinary.js";
import errorHandler from "../middleware/errorHandler.js";
import fs from "fs";
import { User } from "../models/user.model.js";

export const getUser = async (req, res, next) => {
  try {
    const user = req.user;

    res.status(200).json({
      success: true,
      message: "User",
      data: user,
    });
  } catch (error) {
    console.error("Error in get-user", error);
    next(error);
  }
};

export const uploadImage = async (req, res, next) => {
  try {
    if (!req.file) {
      next(errorHandler(400, "No file Uploaded"));
    }

    const user = req.user;

    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "user_uploads_profile",
    });

    fs.unlink(req.file.path, (error) => {
      if (error) {
        console.error("Error deleting old file", error);
        return next(errorHandler(500, "Error deleting old file"));
      }
    });

    user.avatarUrl = result.secure_url;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Image uploaded successfully",
      data: user,
    });
  } catch (error) {
    console.error("Error in uploadImage", error);
    next(error);
  }
};

export const updateUser = async (req, res, next) => {
  try {
    const { username } = req.body;

    if (!username) {
      next(errorHandler(400, "Username is required"));
    }

    const user = req.user;

    const updatedUser = await User.findByIdAndUpdate(
      user._id,
      { username },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    console.error("Error in updateUser", error);
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    const user = req.user;

    await User.findByIdAndDelete(user._id);

    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    console.error("Error in deleteUser", error);
    next(error);
  }
};
