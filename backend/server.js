import Hapi from "@hapi/hapi";
import Inert from "@hapi/inert";
import userRotues from "./routes/userRoute.js";
import connectDB from "./utils/db.js";
import transactionRoutes from "./routes/transactionRoute.js";
import aiRoutes from "./routes/aiRoute.js";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const server = Hapi.server({
  port: 3000,
  host: "localhost",
});
await server.register(Inert);
server.route([
  {
    method: "GET",
    path: "/",
    handler: (req, h) => {
      return h.file(path.join(__dirname, "public/index.html"));
    },
  },
  {
    method: "GET",
    path: "/public/{param*}",
    handler: {
      directory: {
        path: path.join(__dirname, "public"),
        index: false,
      },
    },
  },
]);

server.route([...userRotues, ...transactionRoutes, ...aiRoutes]);
await connectDB();
await server.start();
console.log("Server berjalan pada:", server.info.uri);

process.on("unhandledRejection", (err) => {
  console.error(err);
  process.exit(1);
});
