import User from "../models/userModel.js";

// Helper to validate transaction type
const isValidType = (type) => ["incomes", "expenses"].includes(type);

export const getTransactionsHandler = async (request, h) => {
  const { userId, type } = request.params;

  if (!isValidType(type)) {
    return h.response({ message: "Invalid transaction type." }).code(400);
  }

  try {
    const user = await User.findById(userId);
    if (!user) return h.response({ message: "User not found" }).code(404);

    return h.response(user[type]).code(200);
  } catch (err) {
    return h.response({ message: err.message }).code(500);
  }
};

export const addTransactionHandler = async (request, h) => {
  const { userId, type } = request.params;
  const transactionData = request.payload;

  if (!isValidType(type)) {
    return h.response({ message: "Invalid transaction type." }).code(400);
  }
  console.log(transactionData);
  try {
    const user = await User.findById(userId);
    if (!user) return h.response({ message: "User not found" }).code(404);

    user[type].push(transactionData);
    await user.save();

    return h.response({ message: "Transaction added", transaction: transactionData }).code(201);
  } catch (err) {
    return h.response({ message: err.message }).code(500);
  }
};

export const updateTransactionHandler = async (request, h) => {
  const { userId, type, transactionId } = request.params;
  const updatedData = request.payload;

  if (!isValidType(type)) {
    return h.response({ message: "Invalid transaction type." }).code(400);
  }

  try {
    const user = await User.findById(userId);
    if (!user) return h.response({ message: "User not found" }).code(404);

    const transaction = user[type].id(transactionId);
    if (!transaction) return h.response({ message: "Transaction not found" }).code(404);

    Object.assign(transaction, updatedData);
    await user.save();

    return h.response({ message: "Transaction updated", transaction }).code(200);
  } catch (err) {
    return h.response({ message: err.message }).code(500);
  }
};

export const deleteTransactionHandler = async (request, h) => {
  const { userId, type, transactionId } = request.params;

  if (!isValidType(type)) {
    return h.response({ message: "Invalid transaction type." }).code(400);
  }

  try {
    const user = await User.findById(userId);
    if (!user) return h.response({ message: "User not found" }).code(404);

    user[type] = user[type].filter((tx) => tx._id.toString() !== transactionId);
    await user.save();

    return h.response({ message: "Transaction deleted" }).code(200);
  } catch (err) {
    return h.response({ message: err.message }).code(500);
  }
};
