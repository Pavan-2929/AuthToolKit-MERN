import express from "express";
import verifyToken from "../middleware/verifyToken.js";
import {
  deleteUser,
  getUser,
  updateUser,
  uploadImage,
} from "../controllers/user.controller.js";
import upload from "../config/multer.js";

const userRouter = express.Router();

userRouter.get("/get", verifyToken, getUser);
userRouter.post(
  "/upload/image",
  verifyToken,
  upload.single("image"),
  uploadImage
);
userRouter.put("/update/profile", verifyToken, updateUser);
userRouter.delete("/delete", verifyToken, deleteUser);

export default userRouter;
