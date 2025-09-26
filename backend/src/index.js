const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");

const authRoutes = require("./routes/auth");
const reportRoutes = require("./routes/report");

const app = express();

app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(bodyParser.json());

// API routes
app.use("/auth", authRoutes);
app.use("/", reportRoutes);

// Serve PDFs from backend/generated at /generated
app.use("/generated", express.static(path.join(__dirname, "generated")));

const PORT = 5000;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
