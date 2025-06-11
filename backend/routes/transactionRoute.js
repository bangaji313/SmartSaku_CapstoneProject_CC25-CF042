import {
  getTransactionsHandler,
  addTransactionHandler,
  updateTransactionHandler,
  deleteTransactionHandler,
} from "../handler/transactionHandler.js";

const transactionRoutes = [
  {
    method: "GET",
    path: "/api/users/{userId}/{type}",
    handler: getTransactionsHandler,
  },
  {
    method: "POST",
    path: "/api/users/{userId}/{type}",
    handler: addTransactionHandler,
  },
  {
    method: "PUT",
    path: "/api/users/{userId}/{type}/{transactionId}",
    handler: updateTransactionHandler,
  },
  {
    method: "DELETE",
    path: "/api/users/{userId}/{type}/{transactionId}",
    handler: deleteTransactionHandler,
  },
];

export default transactionRoutes;
