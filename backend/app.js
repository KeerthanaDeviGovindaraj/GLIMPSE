import express from "express";
import morgan from "morgan";
import helmet from "helmet";
import cors from "cors";
import YAML from "yamljs";
import swaggerUi from "swagger-ui-express";
import path from "path";
import multer from "multer"; 


import authRoutes from "./routes/authRoutes.js";
import { protect, authorize } from "./middleware/authMiddleware.js";


const app = express();

app.use(helmet({
  crossOriginResourcePolicy: false,
}));
app.use(cors());
app.use(express.json());
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

// Swagger docs
const swaggerDocument = YAML.load(
  path.join(process.cwd(), "docs/openapi.yaml")
);
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// API routes
app.use("/api/auth", authRoutes);
app.get("/health", (req, res) => res.json({ ok: true }));

// Example Protected Routes
app.get('/api/profile', protect, (req, res) => {
  res.json(req.user);
});

app.get('/api/analyst-data', protect, authorize('analyst', 'admin'), (req, res) => {
  res.json({ message: 'Welcome Analyst/Admin! Here is your data.' });
});

app.get('/api/admin-panel', protect, authorize('admin'), (req, res) => {
  res.json({ message: 'Welcome to the Admin Panel!' });
});

// ----- Global error handler (keeps invalid image format as 400 JSON) -----
app.use((err, req, res, next) => {
  if (
    err instanceof multer.MulterError ||
    (typeof err?.message === "string" &&
      err.message.includes("Invalid file format"))
  ) {
    return res
      .status(400)
      .json({ error: "Invalid file format. Only JPEG, PNG, and GIF are allowed." });
  }
  console.error(err);
  return res.status(500).json({ error: "Server error" });
});

export default app;
