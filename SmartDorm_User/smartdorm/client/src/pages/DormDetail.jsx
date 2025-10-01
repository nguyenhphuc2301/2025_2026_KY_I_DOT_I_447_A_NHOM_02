import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { fetchDormDetail } from "../services/dorm.service";

export default function DormDetail() {
  const { id } = useParams();
  const [dorm, setDorm] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetchDormDetail(id);
        setDorm(res);
      } catch (err) {
        console.error("❌ Lỗi load detail:", err);
      }
    }
    load();
  }, [id]);

  if (!dorm) return <div className="p-6 text-gray-500">Đang tải...</div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Link to="/dorms" className="text-blue-600 hover:underline">← Quay lại</Link>
      <h1 className="text-2xl font-bold mt-2">{dorm.name}</h1>
      <p className="text-gray-600">{dorm.address}</p>


      <div className="mt-4 grid grid-cols-2 gap-4">
        {dorm.images?.map((img, idx) => (
          <img key={idx} src={img} alt="" className="w-full h-48 object-cover rounded" />
        ))}
      </div>

      <div className="mt-4">
        <p><b>Giá:</b> {dorm.price.toLocaleString("vi-VN")}đ / tháng</p>
        <p><b>Sức chứa:</b> {dorm.capacity} — đang ở {dorm.occupied}</p>
        <p><b>Loại phòng:</b> {dorm.gender}</p>
        <p><b>Tiện nghi:</b> {dorm.amenities.join(", ")}</p>
      </div>

      <div className="mt-4">
        <span className="text-yellow-500">⭐ {dorm.rating}</span> 
        <span className="text-gray-500 ml-2">({dorm.reviews} đánh giá)</span>
      </div>
    </div>
  );
}
