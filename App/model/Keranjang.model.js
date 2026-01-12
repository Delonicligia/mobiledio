import mongoose from "mongoose";

const KeranjangItemSchema = new mongoose.Schema({
  _id: {
    type: String,
    required: true,
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Produk",
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
});

const keranjangSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: {
      type: [KeranjangItemSchema],
      required: true,
    },
    status: {
      type: String,
      required: true,
      default: "active",
    },
  },
  {
    timestamps: true,
    collection: "keranjang",
  }
);

export default mongoose.model("Keranjang", keranjangSchema);
