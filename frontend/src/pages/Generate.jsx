import { useState } from "react";
import axios from "axios";

const API_BASE = "http://localhost:5000";

export default function Generate() {
  const [sessionId, setSessionId] = useState("");

  const handleGenerate = async () => {
    try {
      const res = await axios.get(`${API_BASE}/generate-report`, {
        params: { session_id: sessionId }
      });
      if (res.data?.url) {
        window.open(`${API_BASE}${res.data.url}`, "_blank");
      } else {
        alert("No URL returned from server");
      }
    } catch (err) {
      console.error(err);
      alert("Generate failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <div className="w-full max-w-sm bg-white shadow rounded p-6 space-y-4">
        <h2 className="text-2xl font-semibold">Generate Report</h2>
        <input
          className="border p-2 rounded w-full"
          value={sessionId}
          onChange={(e) => setSessionId(e.target.value)}
          placeholder="Enter session ID"
        />
        <button className="bg-purple-600 text-white px-4 py-2 rounded w-full" onClick={handleGenerate}>
          Generate PDF
        </button>
      </div>
    </div>
  );
}
