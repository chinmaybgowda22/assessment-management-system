import { useState } from "react";
import axios from "axios";

const API_BASE = "http://localhost:5000";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const handleLogin = async () => {
    setMsg("");
    setLoading(true);
    try {
      const res = await axios.post(
        `${API_BASE}/auth/login`,
        { username, password },
        { headers: { "Content-Type": "application/json" } }
      );
      const token = res.data?.token || "";
      if (!token) throw new Error("No token returned");
      localStorage.setItem("token", token);
      setMsg("Login successful");
      alert("Login successful");
    } catch (err) {
      const detail =
        err.response?.data?.error ||
        `${err.response?.status || ""} ${err.response?.statusText || ""}`.trim() ||
        err.message;
      setMsg(`Login failed: ${detail}`);
      alert("Login failed");
      console.error("Login error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <div className="w-full max-w-sm bg-white shadow rounded p-6 space-y-4">
        <h2 className="text-2xl font-semibold">Login</h2>
        <input
          className="border p-2 rounded w-full"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
          autoComplete="username"
        />
        <input
          className="border p-2 rounded w-full"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          autoComplete="current-password"
        />
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded w-full disabled:opacity-60"
          onClick={handleLogin}
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
        {msg ? <p className="text-sm text-gray-700">{msg}</p> : null}
      </div>
    </div>
  );
}
