import { loginHandler, registerHandler } from "../handler/userHandler.js";

const userRoutes = [
  {
    method: "POST",
    path: "/api/user/login",
    handler: loginHandler,
  },
  {
    method: "POST",
    path: "/api/user/register",
    handler: registerHandler,
  },
];

export default userRoutes;
