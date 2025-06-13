import { chatHandler } from "../handler/aiHandler.js";

const aiRoutes = [
  {
    method: "POST",
    path: "/chat",
    handler: chatHandler,
  },
];

export default aiRoutes;
