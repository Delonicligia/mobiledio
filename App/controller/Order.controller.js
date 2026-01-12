import Order from "../model/Order.model.js";
import Keranjang from "../model/Keranjang.model.js";
import User from "../model/User.model.js";
import snap from "../config/midtrans.js";
import crypto from "crypto";

// Generate unique order ID
const generateOrderId = () => {
  return `ORDER-${Date.now()}-${crypto
    .randomBytes(4)
    .toString("hex")
    .toUpperCase()}`;
};

// Create Order - Ambil dari keranjang dan generate Snap Token
export const createOrder = async (req, res) => {
  try {
    const userId = req.user.id;

    // Ambil keranjang user dengan populate produk
    const keranjang = await Keranjang.findOne({ userId }).populate(
      "items.product"
    );

    if (!keranjang || keranjang.items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Keranjang kosong, tidak bisa membuat order",
      });
    }

    // Ambil data user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User tidak ditemukan",
      });
    }

    // Hitung total dan siapkan item details untuk Midtrans
    let totalAmount = 0;
    const orderItems = [];
    const midtransItems = [];

    for (const item of keranjang.items) {
      const product = item.product;
      // Gunakan harga promo jika ada, jika tidak gunakan harga normal
      const price = product.promoProduk || product.hargaProduk;
      const subtotal = price * item.quantity;
      totalAmount += subtotal;

      orderItems.push({
        product: product._id,
        quantity: item.quantity,
        price: price,
      });

      midtransItems.push({
        id: product._id.toString(),
        name: product.namaProduk.substring(0, 50), // Midtrans max 50 chars
        price: price,
        quantity: item.quantity,
      });
    }

    // Generate order ID
    const orderId = generateOrderId();

    // Parameter untuk Midtrans Snap
    const parameter = {
      transaction_details: {
        order_id: orderId,
        gross_amount: totalAmount,
      },
      item_details: midtransItems,
      customer_details: {
        first_name: user.username,
        email: user.email,
      },
    };

    // Create Snap Token
    const transaction = await snap.createTransaction(parameter);

    // Simpan order ke database
    const order = await Order.create({
      orderId,
      userId,
      items: orderItems,
      totalAmount,
      paymentStatus: "pending",
      snapToken: transaction.token,
      snapRedirectUrl: transaction.redirect_url,
    });

    // Kosongkan keranjang setelah order dibuat
    await Keranjang.findOneAndUpdate({ userId }, { $set: { items: [] } });

    res.status(201).json({
      success: true,
      message: "Order berhasil dibuat",
      data: {
        order,
        snapToken: transaction.token,
        snapRedirectUrl: transaction.redirect_url,
      },
    });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({
      success: false,
      message: "Gagal membuat order",
      error: error.message,
    });
  }
};

// Get all orders by user
export const getOrdersByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const orders = await Order.find({ userId })
      .populate("items.product")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: "Data order berhasil diambil",
      data: orders,
    });
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({
      success: false,
      message: "Gagal mengambil data order",
      error: error.message,
    });
  }
};

// Get order by ID
export const getOrderById = async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await Order.findOne({ orderId }).populate("items.product");

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order tidak ditemukan",
      });
    }

    res.status(200).json({
      success: true,
      message: "Data order berhasil diambil",
      data: order,
    });
  } catch (error) {
    console.error("Error fetching order:", error);
    res.status(500).json({
      success: false,
      message: "Gagal mengambil data order",
      error: error.message,
    });
  }
};

// Midtrans Webhook Notification Handler
export const handleNotification = async (req, res) => {
  try {
    const notification = req.body;

    const orderId = notification.order_id;
    const transactionStatus = notification.transaction_status;
    const fraudStatus = notification.fraud_status;
    const paymentType = notification.payment_type;

    console.log(`Notification received for order: ${orderId}`);
    console.log(
      `Transaction status: ${transactionStatus}, Fraud status: ${fraudStatus}`
    );

    let paymentStatus;

    if (transactionStatus === "capture") {
      if (fraudStatus === "accept") {
        paymentStatus = "success";
      } else if (fraudStatus === "challenge") {
        paymentStatus = "pending";
      }
    } else if (transactionStatus === "settlement") {
      paymentStatus = "success";
    } else if (transactionStatus === "cancel" || transactionStatus === "deny") {
      paymentStatus = "failed";
    } else if (transactionStatus === "expire") {
      paymentStatus = "expire";
    } else if (transactionStatus === "pending") {
      paymentStatus = "pending";
    }

    // Update order status
    const order = await Order.findOneAndUpdate(
      { orderId },
      {
        paymentStatus,
        paymentType,
      },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order tidak ditemukan",
      });
    }

    console.log(`Order ${orderId} updated to status: ${paymentStatus}`);

    res.status(200).json({
      success: true,
      message: "Notification processed",
    });
  } catch (error) {
    console.error("Error handling notification:", error);
    res.status(500).json({
      success: false,
      message: "Gagal memproses notification",
      error: error.message,
    });
  }
};
