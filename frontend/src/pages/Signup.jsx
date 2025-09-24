import { useState } from "react";
import axios from "axios";

const API_BASE = "http://localhost:5000";

export default function Signup() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");

  const handleSignup = async () => {
    setMsg("");
    try {
      await axios.post(`${API_BASE}/auth/signup`, { username, password }, {
        headers: { "Content-Type": "application/json" }
      });
      setMsg("Signup successful");
      alert("Signup successful!");
    } catch (err) {
      const detail = err.response?.data?.error || err.message;
      setMsg(`Signup failed: ${detail}`);
      alert("Signup failed");
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <div className="w-full max-w-sm bg-white shadow rounded p-6 space-y-4">
        <h2 className="text-2xl font-semibold">Signup</h2>
        <input
          className="border p-2 rounded w-full"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
        />
        <input
          className="border p-2 rounded w-full"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
        />
        <button className="bg-green-600 text-white px-4 py-2 rounded w-full" onClick={handleSignup}>
          Signup
        </button>
        {msg ? <p className="text-sm text-gray-700">{msg}</p> : null}
      </div>
    </div>
  );
}
