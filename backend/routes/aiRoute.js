import { chatHandler, predictionHandler, recommendationHandler } from "../handler/aiHandler.js";

const aiRoutes = [
  {
    method: "POST",
    path: "/chat",
    handler: chatHandler,
  },
  {
    method: "GET",
    path: "/recommendation",
    handler: recommendationHandler,
  },
  {
    method: "GET",
    path: "/prediction",
    handler: predictionHandler,
  },
];

export default aiRoutes;
