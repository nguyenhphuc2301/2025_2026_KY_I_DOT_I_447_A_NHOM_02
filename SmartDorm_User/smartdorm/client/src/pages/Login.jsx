import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { login } from "../services/authService";

function Login() {
  const [formData, setFormData] = useState({
    email: "",
    mat_khau: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await login(formData);
      localStorage.setItem("token", res.data.token);
      alert("Đăng nhập thành công!");
      navigate("/");
    } catch (err) {
      console.error(err);
      alert("Sai email hoặc mật khẩu!");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="bg-white shadow-2xl rounded-2xl p-8 w-full max-w-md">
        <div className="flex justify-center mb-6">
          <div className="bg-blue-600 text-white p-4 rounded-full">
            <i className="fas fa-home text-2xl"></i>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-center mb-2">
          Đăng nhập vào DormSpace
        </h2>
        <p className="text-center text-gray-500 mb-6">
          Truy cập vào hệ thống để đặt phòng ký túc xá
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="email"
              name="email"
              placeholder="Email"
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <input
              type="password"
              name="mat_khau"
              placeholder="Mật khẩu"
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.mat_khau}
              onChange={handleChange}
              required
            />
          </div>

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center">
              <input type="checkbox" className="mr-2" />
              Ghi nhớ đăng nhập
            </label>
            <a href="#" className="text-blue-600 hover:underline">
              Quên mật khẩu?
            </a>
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-3 rounded-lg font-semibold hover:opacity-90 transition"
          >
            Đăng nhập
          </button>
        </form>

        <p className="text-center mt-6 text-gray-600">
          Chưa có tài khoản?{" "}
          <Link to="/register" className="text-blue-600 font-semibold">
            Đăng ký ngay
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
