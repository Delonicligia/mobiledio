import argon2 from "argon2";
import User from "../model/User.model.js";
import "dotenv/config";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
  try {
    const { username, password, email } = req.body;

    if (!username || !password || !email) {
      return res.status(404).json({
        message: "gagal mendapatkan data username, password, email",
      });
    }

    const existingEmail = await User.findOne({ email: email });
    if (existingEmail) {
      return res.status(500).json({
        message: "email telah terdaftar!",
      });
    }

    const hash = await argon2.hash(password);

    const NewUser = await User.create({
      username,
      email,
      password: hash,
    });

    res.status(200).json({
      success: true,
      message: "berhasil membuat user",
      data: NewUser,
    });
  } catch (error) {
    console.error("error registered", error.message);
    res.status(500).json({
      success: false,
      message: "gagal membuat user",
      error: error.message,
    });
  }
};

export const login = async (req, res) => {
  try {
    const { username ,email, password } = req.body;
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Email tidak terdaftar",
      });
    }

    const isPasswordValid = await argon2.verify(user.password, password);

    if (!isPasswordValid) {
      return res.status(400).json({
        success: false,
        message: "Password salah",
      });
    }

    const token = jwt.sign(
      {
        id: user._id,
        username: user.username,
        email: user.email,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(200).json({
      success: true,
      message: "Login berhasil",
      data: {
        id: user._id,
        username: user.username,
        email: user.email,
        token: token,
      },
    });
  } catch (error) {
    console.error("Error login:", error);
    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan server",
      error: error.message,
    });
  }
};

export const getAllUser = async (req, res) => {
  try {
    const getUser = await User.find();

    res.status(200).json({
      success: true,
      message: "berhasil mengambil semua data user",
      data: getUser,
    });
  } catch (error) {
    console.error("error registered", error.message);
    res.status(500).json({
      success: false,
      message: "gagal mengambil data user",
      error: error.message,
    });
  }
};

export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const userByid = await User.findById(id);

    res.status(200).json({
      success: true,
      message: "Berhail mendapatkan user",
      data: userByid,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "gagal mendapatkan user",
      error: error.message,
    });
  }
};

export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User tidak ditemukan",
      });
    }

    res.status(200).json({
      success: true,
      message: "Berhasil mendapatkan data user",
      data: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Gagal mendapatkan data user",
      error: error.message,
    });
  }
};
