import Produk from "../model/Produk.model.js";

export const createProduk = async (req, res) => {
  try {
    const {
      namaProduk,
      hargaProduk,
      promoProduk,
      deskripsiProduk,
      urlGambarProduk,
      stokProduk,
      vendorProduk,
      kategoriProduk,
    } = req.body;

    const CreateProduk = await Produk.create({
      namaProduk,
      hargaProduk,
      promoProduk,
      deskripsiProduk,
      urlGambarProduk,
      stokProduk,
      vendorProduk,
      kategoriProduk,
    });

    res.status(200).json({
      success: true,
      message: "berhasil membuat produk",
      data: CreateProduk,
    });
  } catch (error) {
    console.error("error create", error.message);
    res.status(500).json({
      success: false,
      message: "gagal membuat produk",
      error: error.message,
    });
  }
};

export const getProdukByKategori = async (req, res) => {
  try {
    const { kategori } = req.params;

    const getProdukByCategory = await Produk.find({ kategoriProduk: kategori });

    res.status(200).json({
      success: true,
      message: "berhasil mengambil produk bedasarkan Kategori",
      data: getProdukByCategory,
    });
  } catch (error) {
    console.error("error get", error.message);
    res.status(500).json({
      success: false,
      message: "gagal mengambil produk bedasarkan kategori",
      error: error.message,
    });
  }
};

export const getAllProduk = async (req, res) => {
  try {
    const getProduk = await Produk.find();
    res.status(200).json({
      success: true,
      message: "berhasil mengambil data produk",
      data: getProduk,
    });
  } catch (error) {
    console.error("error create", error.message);
    res.status(500).json({
      success: false,
      message: "gagal mengambil data produk",
      error: error.message,
    });
  }
};
