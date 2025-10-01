// client/src/services/dorm.service.js
export async function fetchDorms(params) {
  const searchParams = new URLSearchParams();

  for (const [key, value] of Object.entries(params)) {
    if (value === "" || value == null) continue;

    if (Array.isArray(value)) {
      if (value.length > 0) searchParams.append(key, value.join(","));
    } else {
      searchParams.append(key, value);
    }
  }

  const res = await fetch(`http://localhost:8080/api/dorms?${searchParams.toString()}`);
  if (!res.ok) throw new Error("❌ Lỗi API /api/dorms");
  return res.json();
}

export async function fetchDormDetail(id) {
  const res = await fetch(`http://localhost:8080/api/dorms/${id}`);
  if (!res.ok) throw new Error("❌ Lỗi API /api/dorms/:id");
  return res.json();
}
