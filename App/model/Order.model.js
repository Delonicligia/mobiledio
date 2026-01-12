import mongoose from "mongoose";

const OrderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Produk",
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
});

const OrderSchema = new mongoose.Schema(
  {
    orderId: {
      type: String,
      required: true,
      unique: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: [OrderItemSchema],
    totalAmount: {
      type: Number,
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "success", "failed", "expire", "cancel"],
      default: "pending",
    },
    paymentType: {
      type: String,
      default: null,
    },
    snapToken: {
      type: String,
    },
    snapRedirectUrl: {
      type: String,
    },
  },
  {
    timestamps: true,
    collection: "orders",
  }
);

export default mongoose.model("Order", OrderSchema);
