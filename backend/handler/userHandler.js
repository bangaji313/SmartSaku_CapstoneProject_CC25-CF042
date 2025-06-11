import User from "../models/userModel.js";
import { generateToken } from "../utils/token.js";
import { addUser, findUserByUsername, validatePassword } from "../utils/users.js";
import bcrypt from "bcrypt";

export const loginHandler = async (request, h) => {
  const { email, password } = request.payload;

  try {
    // Cari user berdasarkan email dan ambil password (karena password select: false default)
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return h.response({ message: "Email atau password salah" }).code(401);
    }

    // Bandingkan password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return h.response({ message: "Email atau password salah" }).code(401);
    }

    // Kalau berhasil login, kembalikan data user (tanpa password)
    const token = generateToken(user);
    return h
      .response({
        message: "Login berhasil",
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
        },
      })
      .code(200);
  } catch (error) {
    return h.response({ message: error.message || "Terjadi kesalahan saat login" }).code(500);
  }
};

export const registerHandler = async (request, h) => {
  const { name, email, password } = request.payload;

  try {
    // Cek apakah email sudah terdaftar
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return h.response({ message: "Email sudah digunakan" }).code(400);
    }

    // Buat user baru
    const newUser = await User.create({ name, email, password });

    return h
      .response({
        message: "Registrasi berhasil",
        user: {
          id: newUser._id,
          name: newUser.name,
          email: newUser.email,
        },
      })
      .code(201);
  } catch (error) {
    return h
      .response({
        message: error.message || "Terjadi kesalahan saat registrasi",
      })
      .code(400);
  }
};
