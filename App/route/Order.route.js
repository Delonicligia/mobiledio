import express from "express";
import {
  createOrder,
  getOrdersByUser,
  getOrderById,
  handleNotification,
} from "../controller/Order.controller.js";
import { authMiddleware } from "../middleware/auth.js";

const OrderRoute = express.Router();

// Protected routes (require authentication)
OrderRoute.post("/", authMiddleware, createOrder);
OrderRoute.get("/user/:userId", authMiddleware, getOrdersByUser);
OrderRoute.get("/:orderId", authMiddleware, getOrderById);

// Webhook route (no auth - called by Midtrans)
OrderRoute.post("/notification", handleNotification);

export default OrderRoute;
