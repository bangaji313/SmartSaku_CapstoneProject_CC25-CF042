import Hapi from "@hapi/hapi";
import userRotues from "./routes/userRoute.js";
import connectDB from "./utils/db.js";
import transactionRoutes from "./routes/transactionRoute.js";
const server = Hapi.server({
  port: 3000,
  host: "localhost",
});
server.route({
  method: "GET",
  path: "/",
  handler: (req, h) => {
    return h.response("<h1>Hello World</h1>").type("text/html");
  },
});

server.route([...userRotues, ...transactionRoutes]);
await connectDB();
await server.start();
console.log("Server berjalan pada:", server.info.uri);

process.on("unhandledRejection", (err) => {
  console.error(err);
  process.exit(1);
});
