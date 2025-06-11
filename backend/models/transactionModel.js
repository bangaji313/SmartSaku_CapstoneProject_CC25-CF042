import mongoose from "mongoose";
const transactionSchema = new mongoose.Schema({
  nominal: {
    type: Number,
    required: true,
    min: [0, "Nominal harus bernilai positif"],
  },
  kategori: {
    type: String,
    required: true,
    trim: true,
  },
  deskripsi: {
    type: String,
    trim: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

export default transactionSchema;
