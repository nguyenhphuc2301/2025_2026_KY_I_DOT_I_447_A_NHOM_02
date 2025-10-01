import express from "express";
import { register, login } from "../services/auth.service.js";

const router = express.Router();

// Đăng ký
router.post("/register", async (req, res) => {
  try {
    const user = await register(req.body);
    res.json(user);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Đăng nhập
router.post("/login", async (req, res) => {
  try {
    const { token, role } = await login(req.body);
    res.json({ token, role });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

export default router;
