import express from "express";
import { createProduk, getAllProduk, getProdukByKategori } from "../controller/Produk.controller.js";

const ProdukRoute = express.Router();

ProdukRoute.get("/", getAllProduk);
ProdukRoute.get("/kategori/:kategori", getProdukByKategori);
ProdukRoute.post("/", createProduk);
export default ProdukRoute;