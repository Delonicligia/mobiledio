import express from "express";
import {
  register,
  getAllUser,
  login,
  getUserById,
  getMe,
} from "../controller/User.controller.js";
import { authMiddleware } from "../middleware/auth.js";

const UserRoute = express.Router();

UserRoute.get("/", getAllUser);
UserRoute.get("/me", authMiddleware, getMe);
UserRoute.get("/:id", getUserById);
UserRoute.post("/register", register);
UserRoute.post("/login", login);

export default UserRoute;
