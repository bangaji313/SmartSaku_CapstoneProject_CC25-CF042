import Hapi from "@hapi/hapi";
import { loginHandler, registerHandler } from "./handler/userHandler.js";

const server = Hapi.server({
  port: 3000,
  host: "localhost",
});

server.route([
  {
    method: "POST",
    path: "/api/login",
    handler: loginHandler,
  },
  {
    method: "POST",
    path: "/api/register",
    handler: registerHandler,
  },
]);

await server.start();
console.log("Server berjalan pada:", server.info.uri);

process.on("unhandledRejection", (err) => {
  console.error(err);
  process.exit(1);
});
