const express = require("express");
const fs = require("fs-extra");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const path = require("path");

const router = express.Router();

const USERS_FILE = path.join(__dirname, "..", "..", "users.json");
const SECRET = "my_secret_key";

// Initialize file
(async () => {
  try {
    await fs.ensureFile(USERS_FILE);
    const stat = await fs.stat(USERS_FILE);
    if (stat.size === 0) await fs.writeJson(USERS_FILE, []);
  } catch (e) {
    console.error("Failed to init users.json:", e);
  }
})();

router.post("/signup", async (req, res) => {
  try {
    const { username, password } = req.body || {};
    if (!username || !password) return res.status(400).json({ error: "username and password required" });

    const users = await fs.readJson(USERS_FILE).catch(async () => {
      await fs.writeJson(USERS_FILE, []);
      return [];
    });

    if (users.find(u => u.username === username)) {
      return res.status(409).json({ error: "User already exists" });
    }

    const hashed = await bcrypt.hash(password, 10);
    users.push({ username, password: hashed });
    await fs.writeJson(USERS_FILE, users, { spaces: 2 });

    return res.json({ message: "Signup successful" });
  } catch (err) {
    console.error("Signup error:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body || {};
    if (!username || !password) return res.status(400).json({ error: "username and password required" });

    const users = await fs.readJson(USERS_FILE).catch(() => []);
    const user = users.find(u => u.username === username);
    if (!user) return res.status(400).json({ error: "Invalid credentials" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ error: "Invalid credentials" });

    const token = jwt.sign({ username }, SECRET, { expiresIn: "1h" });
    return res.json({ token });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
