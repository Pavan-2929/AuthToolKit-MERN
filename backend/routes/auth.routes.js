import express from "express";
import {
  forgetPasswordController,
  googleLoginController,
  loginController,
  logoutController,
  magicLinkController,
  registerController,
  resetPasswordController,
  verifyCode,
  verifyMagicLink,
} from "../controllers/auth.controller.js";
import verifyToken from "../middleware/verifyToken.js";

const authRouter = express.Router();

authRouter.post("/register", registerController);
authRouter.post("/verify", verifyCode);
authRouter.post("/login", loginController);
authRouter.post("/logout", verifyToken, logoutController);
authRouter.post("/forgetPassword", forgetPasswordController);
authRouter.put("/resetPassword/:token", resetPasswordController);
authRouter.post("/google", googleLoginController);
authRouter.post("/magic-link", magicLinkController);
authRouter.post("/magic-link/verify/:token", verifyMagicLink);
authRouter.get("/", verifyToken);

export default authRouter;
