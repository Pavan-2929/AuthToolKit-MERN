import jwt from "jsonwebtoken";
import errorHandler from "./errorHandler.js";
import { User } from "../models/user.model.js";

const verifyToken = async (req, res, next) => {
  const { token } = req.cookies;

  if (!token) {
    return next(errorHandler(400, "Unauthenticated"));
  }

  const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);

  req.user = await User.findById(decodedToken.id);
  console.log(req.user);

  next();
};

export default verifyToken;
