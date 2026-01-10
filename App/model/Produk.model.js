import mongoose from "mongoose";

const ProdukSchema = new mongoose.Schema({
    namaProduk: {
        type: String,
        required: [true, "nama Produk Wajib Diisi"], 
    },
    hargaProduk: {
        type: Number,
        required: [true, "harga produk wajib diisi"],
    },
    promoProduk:{
        type: Number,
    },
    deskripsiProduk: {
        type: String,
        required: [true, "deskripsi wajib diisi"],
    },
    urlGambarProduk: {
        type: String,
        required: [true, "gambar wajib diisi"]
    },
    stokProduk:{
        type: String,
        required: [true, "stok wajib diisi"]
    },
    vendorProduk:{
        type: String,
        required: [true, "vendor wajib diisi"]
    },
    kategoriProduk: {
        type: String,
        required: [true, "kategori wajib diisi"]
    }
},{
    timestamps: true,
    collection: 'produk',
});

const Produk = mongoose.model("Produk", ProdukSchema);

export default Produk;