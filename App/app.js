import express from "express";
import UserRoute from "./route/User.route.js";
import ProdukRoute from "./route/Produk.route.js";
import KeranjangRoute from "./route/Keranjang.route.js";
import OrderRoute from "./route/Order.route.js";
import cors from "cors";

const app = express();

app.use(cors());

app.use(express.json());

app.use("/user", UserRoute);
app.use("/produk", ProdukRoute);
app.use("/keranjang", KeranjangRoute);
app.use("/order", OrderRoute);

export default app;
