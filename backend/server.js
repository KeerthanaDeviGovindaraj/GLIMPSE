import dotenv from "dotenv";
dotenv.config();

import app from "./app.js";
import { connectDB } from "./config/db.js";

const PORT = process.env.PORT || 4000;

async function start() {
  await connectDB(process.env.MONGODB_URI);
  app.listen(PORT, () => {
    console.log(`[server] listening on http://localhost:${PORT}`);
    console.log(`[docs] Swagger UI at http://localhost:${PORT}/docs`);
  });
}

start().catch((err) => {
  console.error(err);
  process.exit(1);
});
