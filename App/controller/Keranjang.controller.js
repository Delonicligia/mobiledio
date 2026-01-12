import Keranjang from "../model/Keranjang.model.js";
import Produk from "../model/Produk.model.js";
import User from "../model/User.model.js";

export const getKeranjang = async (req, res) => {
  try {
    const keranjang = await Keranjang.findOne({
      userId: req.params.userId,
    }).populate("items.product");
    res.status(200).json(keranjang);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const addKeranjang = async (req, res) => {
  const { productId, quantity } = req.body;
  const userId = req.user.id;

  try {
    const produk = await Produk.findById(productId);

    if (!produk) {
      return res.status(404).json({ message: "Produk tidak ditemukan" });
    }

    let keranjang = await Keranjang.findOne({ userId });

    if (!keranjang) {
      // Buat keranjang baru jika belum ada
      keranjang = new Keranjang({
        userId,
        items: [
          {
            _id: productId,
            product: productId,
            quantity,
          },
        ],
        status: "active",
      });
    } else {
      // Cek apakah produk sudah ada di keranjang
      const existingItem = keranjang.items.find(
        (item) => item.product.toString() === productId
      );

      if (existingItem) {
        // Update quantity jika produk sudah ada
        existingItem.quantity += quantity;
      } else {
        // Tambahkan produk baru ke keranjang
        keranjang.items.push({
          _id: productId,
          product: productId,
          quantity,
        });
      }
    }

    const updatedKeranjang = await keranjang.save();

    res.status(201).json(updatedKeranjang);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteItemFromKeranjang = async (req, res) => {
    try {
      const { productId } = req.params;
      const userId = req.user.id;
      
      const keranjang = await Keranjang.findOneAndUpdate(
        { userId },
        { $pull: { items: { product: productId } } },
        { new: true }
      );
      
      res.status(200).json({
        success: true,
        message: "berhasil menghapus item dari keranjang",
        data: keranjang,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
}