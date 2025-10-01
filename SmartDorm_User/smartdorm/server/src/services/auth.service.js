import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import pool from "../config/db.js";

const TABLE = "nguoi_dung";

// ===== Đăng ký =====
export async function register({ ho_ten, email, mat_khau, so_dien_thoai, vai_tro_id = "SV" }) {
  const id = uuidv4();
  await pool.execute(
    `INSERT INTO ${TABLE}(id, ho_ten, email, mat_khau, so_dien_thoai, vai_tro_id) VALUES (?,?,?,?,?,?)`,
    [id, ho_ten, email, mat_khau, so_dien_thoai, vai_tro_id]
  );
  return { id, email };
}

// ===== Đăng nhập =====
export async function login({ email, mat_khau }) {
  const [rows] = await pool.execute(`SELECT * FROM ${TABLE} WHERE email=? LIMIT 1`, [email]);

  const user = rows[0];
  if (!user) throw new Error("Email không tồn tại");

  if (mat_khau !== user.mat_khau) throw new Error("Mật khẩu không đúng");

  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.vai_tro_id },
    "secret123",
    { expiresIn: "1h" }
  );

  return { token, role: user.vai_tro_id };
}
