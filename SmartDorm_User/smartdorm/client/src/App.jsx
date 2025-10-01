// client/src/App.jsx
import { Routes, Route } from "react-router-dom";
import HomeVisitor from "./pages/HomeVisitor";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dorms from "./pages/Dorms";

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomeVisitor />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dorms" element={<Dorms />} />
    </Routes>
  );
}

export default App;
