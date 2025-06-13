import { spawn } from "child_process";

export const chatHandler = async (req, h) => {
  const userInput = req.payload.message;

  return new Promise((resolve, reject) => {
    const python = spawn("python3", ["../MachineLearning-Seno/chatbot_inference.py", userInput]);

    let response = "";
    let errorOutput = "";

    python.stdout.on("data", (data) => {
      response += data.toString();
    });

    python.stderr.on("data", (data) => {
      errorOutput += data.toString();
    });
    python.on("close", (code) => {
      if (code !== 0) {
        return resolve(h.response({ error: errorOutput || "Something went wrong." }).code(500));
      } else {
        const str = response.split("\n");
        return resolve(h.response({ reply: str[1] }).code(200));
      }
    });
  });
};
