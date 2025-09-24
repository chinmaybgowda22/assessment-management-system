import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Generate from "./pages/Generate";

export default function App() {
  return (
    <BrowserRouter>
      <div className="p-4 border-b">
        <nav className="flex gap-4">
          <Link className="text-blue-600" to="/login">Login</Link>
          <Link className="text-blue-600" to="/signup">Signup</Link>
          <Link className="text-blue-600" to="/generate">Generate</Link>
        </nav>
      </div>
      <Routes>
        <Route path="/" element={<div className="p-6 text-2xl">Home</div>} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/generate" element={<Generate />} />
      </Routes>
    </BrowserRouter>
  );
}
