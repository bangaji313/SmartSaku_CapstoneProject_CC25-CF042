import mongoose from "mongoose";
import transactionSchema from "./transactionModel.js";

const DataTransactionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  incomes: [transactionSchema],
  expenses: [transactionSchema],
});

const DataTransaction = mongoose.model("Data-Transaction", DataTransactionSchema);
export default DataTransaction;
