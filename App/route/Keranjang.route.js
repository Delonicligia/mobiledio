import express from "express";
import {
  getKeranjang,
  addKeranjang,
  deleteItemFromKeranjang,
} from "../controller/Keranjang.controller.js";
import { authMiddleware } from "../middleware/auth.js";

const KeranjangRoute = express.Router();

KeranjangRoute.get("/:userId", authMiddleware, getKeranjang);
KeranjangRoute.post("/add", authMiddleware, addKeranjang);
KeranjangRoute.delete("/:productId", authMiddleware, deleteItemFromKeranjang);

export default KeranjangRoute;
