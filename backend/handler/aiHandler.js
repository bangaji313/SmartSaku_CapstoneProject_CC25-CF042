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

export const recommendationHandler = async (req, h) => {
  return new Promise((resolve, reject) => {
    const py = spawn("python3", ["../MachineLearning-Naia/get_recommendation.py"]);
    let result = "";

    py.stdout.on("data", (data) => {
      result += data.toString();
    });

    py.stderr.on("data", (data) => {
      console.error("stderr:", data.toString());
    });

    py.on("close", (code) => {
      const arr = result.split("\n");
      resolve({ rekomendasi: arr[3] });
    });
  });
};

export const predictionHandler = async (req, h) => {
  // Baca data dummy dari file
  const spendingArray = [10000, 200000, 3000000, 0, 1000, 9000000, 7000000];

  if (!Array.isArray(spendingArray) || spendingArray.length !== 7) {
    return h.response({ error: "Dummy data harus berisi 7 angka pengeluaran" }).code(400);
  }

  return new Promise((resolve, reject) => {
    const args = spendingArray.map(String);
    console.log(args);
    const python = spawn("python3", ["../MachineLearning-Yulia/get_prediction.py", ...args]);

    let result = "";
    let error = "";

    python.stdout.on("data", (data) => {
      result += data.toString();
    });

    python.stderr.on("data", (data) => {
      error += data.toString();
    });

    python.on("close", (code) => {
      console.log(code, result, error);
      if (result) {
        // Coba ekstrak angka prediksi dari output
        const match = result.match(/Prediksi Pengeluaran Besok:\s*([0-9,.]+)/);
        const prediction = match ? match[1] : null;

        resolve({
          hasil: result.split("\n")[0],
        });
      } else {
        resolve({
          error: "Gagal menjalankan prediksi",
          stderr: error,
          stdout: result,
        });
      }
    });
  });
};
