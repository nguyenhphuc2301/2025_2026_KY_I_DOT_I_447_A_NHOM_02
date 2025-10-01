import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes.js";
import dormRoutes from "./routes/dorm.routes.js";
import path from "path";
import { fileURLToPath } from "url";

// Fix __dirname trong ES Module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// middleware
app.use(cors({
  origin: "http://localhost:5173",   // cho phép React frontend gọi API
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));
// routes
app.use("/api/auth", authRoutes);
app.use("/api/dorms", dormRoutes);

// start server
const PORT = 8080;
app.listen(PORT, () => {
  console.log(`✅ Server chạy tại cổng ${PORT}`);
});
