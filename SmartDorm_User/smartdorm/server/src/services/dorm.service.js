// server/src/services/dorm.service.js
import pool from "../config/db.js";

function sanitizeLike(s) {
  return s?.replace(/[%_]/g, (m) => `\\${m}`) ?? "";
}

/**
 * Lấy danh sách phòng (có tìm kiếm + lọc + phân trang)
 */
export async function listDorms({
  q,
  area,
  priceMin,
  priceMax,
  type,
  amenities,
  page = 1,
  limit = 6,
  sort = "default",
}) {
  const offset = (page - 1) * limit;
  let where = " WHERE 1=1 ";
  const params = [];

  // 🔎 Tìm kiếm
if (q) {
  const s = `%${sanitizeLike(q)}%`;
  where += ` AND (
      P.so_phong LIKE ? ESCAPE '\\'
      OR T.ten_toa LIKE ? ESCAPE '\\'
      OR T.dia_chi LIKE ? ESCAPE '\\'
      OR CONCAT(T.ten_toa, ' - Phòng ', P.so_phong) LIKE ? ESCAPE '\\'
  ) `;
  params.push(s, s, s, s);
}

  // 📍 Lọc khu vực
  if (area) {
    where += " AND T.dia_chi LIKE ? ";
    params.push(`%${sanitizeLike(area)}%`);
  }

  // 👨👩 Loại phòng
  if (type && ["nam", "nu", "khac"].includes(type)) {
    where += " AND P.gioi_tinh = ? ";
    params.push(type);
  }

  // 💰 Giá
  if (priceMin) {
    where += " AND P.gia_tien >= ? ";
    params.push(Number(priceMin));
  }
  if (priceMax) {
    where += " AND P.gia_tien <= ? ";
    params.push(Number(priceMax));
  }

  // 🛠️ Tiện nghi
  let havingAmen = "";
  let amenParams = [];
  if (amenities) {
    const arr = Array.isArray(amenities) ? amenities : amenities.split(",");
    if (arr.length > 0) {
      havingAmen = `
        HAVING SUM(CASE WHEN tn.ten_tien_nghi IN (${arr.map(() => "?").join(",")}) 
                   THEN 1 ELSE 0 END) = ?
      `;
      amenParams = [...arr, arr.length];
    }
  }

  // 🔽 Sort
  let orderBy = " ORDER BY P.id ";
  if (sort === "priceAsc") orderBy = " ORDER BY P.gia_tien ASC ";
  if (sort === "priceDesc") orderBy = " ORDER BY P.gia_tien DESC ";

  // Đếm tổng
  const countSql = `
    SELECT COUNT(DISTINCT P.id) AS total
    FROM phong P
    LEFT JOIN toa_nha T ON T.id = P.toa_nha_id
    LEFT JOIN tien_nghi_phong tn ON tn.phong_id = P.id
    ${where}
  `;
  const [countRows] = await pool.query(countSql, params);
  const total = countRows[0]?.total || 0;

  // Query danh sách
  const sql = `
    SELECT
      P.id,
      P.so_phong,
      P.tang,
      P.suc_chua,
      P.so_nguoi_dang_o,
      P.gioi_tinh,
      P.gia_tien,
      P.trang_thai,
      T.ten_toa,
      T.dia_chi,
      MIN(A.url_anh) AS image_url,
      GROUP_CONCAT(DISTINCT tn.ten_tien_nghi ORDER BY tn.ten_tien_nghi SEPARATOR ',') AS amenities
    FROM phong P
    LEFT JOIN toa_nha T ON T.id = P.toa_nha_id
    LEFT JOIN anh_phong A ON A.phong_id = P.id
    LEFT JOIN tien_nghi_phong tn ON tn.phong_id = P.id
    ${where}
    GROUP BY P.id
    ${havingAmen}
    ${orderBy}
    LIMIT ? OFFSET ?
  `;
  const [rows] = await pool.query(sql, [...params, ...amenParams, Number(limit), offset]);

  const items = rows.map(r => ({
    id: r.id,
    name: `KTX ${r.ten_toa || "Chưa rõ"} - Phòng ${r.so_phong}`,
    address: r.dia_chi || "Chưa rõ",
    gender: r.gioi_tinh,
    capacity: r.suc_chua,
    occupied: r.so_nguoi_dang_o,
    price: Number(r.gia_tien),
    status: r.trang_thai,
    image: r.image_url ? `http://localhost:8080/uploads/${r.image_url}` : null,
    amenities: r.amenities ? r.amenities.split(",") : [],
    rating: 4 + Math.random(), // demo
    reviews: 50 + Math.floor(Math.random() * 200), // demo
  }));

  return { items, total, page: Number(page), limit: Number(limit) };
}

/**
 * Lấy chi tiết 1 phòng
 */
export async function getDormDetail(id) {
  const sql = `
    SELECT
      P.id,
      P.so_phong,
      P.tang,
      P.suc_chua,
      P.so_nguoi_dang_o,
      P.gioi_tinh,
      P.gia_tien,
      P.trang_thai,
      T.ten_toa,
      T.dia_chi
    FROM phong P
    JOIN toa_nha T ON T.id = P.toa_nha_id
    WHERE P.id = ?
    LIMIT 1;
  `;
  const [rows] = await pool.query(sql, [id]);
  if (!rows.length) return null;

  const [imgs] = await pool.query(
    `SELECT url_anh FROM anh_phong WHERE phong_id = ? ORDER BY ngay_tai_len DESC`,
    [id]
  );

  const [amen] = await pool.query(
    `SELECT ten_tien_nghi FROM tien_nghi_phong WHERE phong_id = ?`,
    [id]
  );

  const r = rows[0];
  return {
    id: r.id,
    name: `KTX ${r.ten_toa} - Phòng ${r.so_phong}`,
    address: r.dia_chi,
    gender: r.gioi_tinh,
    capacity: r.suc_chua,
    occupied: r.so_nguoi_dang_o,
    price: Number(r.gia_tien),
    status: r.trang_thai,
    images: imgs.map(x => x.url_anh),
    amenities: amen.map(x => x.ten_tien_nghi),
    rating: 4.5,
    reviews: 100,
  };
}
