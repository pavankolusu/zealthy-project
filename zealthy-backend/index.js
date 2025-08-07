// zealthy-backend/index.js

const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 4000;

// ✅ Middleware with proper CORS setup for Render
app.use(cors({
  origin: "https://zealthy-frontend-4t3r.onrender.com", // allow only your frontend
  credentials: true
}));
app.use(express.json());

// 🧩 Initial dynamic form configuration (editable from Admin panel)
let config = [
  { component: "aboutMe", page: 2 },
  { component: "birthdate", page: 2 },
  { component: "address", page: 3 },
  { component: "city", page: 3 },
  { component: "state", page: 3 },
  { component: "zip", page: 3 },
];

// 👥 In-memory user store (no database yet)
let users = [];

/**
 * @route   GET /api/admin/config
 * @desc    Get current onboarding form config
 */
app.get("/api/admin/config", (req, res) => {
  console.log("🛠️ GET /api/admin/config called");
  res.status(200).json(config);
});

/**
 * @route   POST /api/admin/config
 * @desc    Update onboarding form config
 */
app.post("/api/admin/config", (req, res) => {
  const updatedConfig = req.body;

  if (!Array.isArray(updatedConfig)) {
    return res.status(400).json({ message: "Invalid config format. Must be an array." });
  }

  config = updatedConfig;
  console.log("✅ Config updated:", config);
  res.status(200).json({ message: "Config updated" });
});

/**
 * @route   POST /api/users
 * @desc    Register a new user
 */
app.post("/api/users", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required." });
  }

  const existingUser = users.find((u) => u.email === email);
  if (existingUser) {
    return res.status(409).json({ message: "User already exists!" });
  }

  users.push(req.body);
  console.log("👤 New user added:", req.body);
  res.status(201).json({ message: "User registered successfully" });
});

/**
 * @route   GET /api/users
 * @desc    Get all users
 */
app.get("/api/users", (req, res) => {
  res.status(200).json(users);
});

/**
 * @route   Health check
 */
app.get("/", (req, res) => {
  res.send("✅ Zealthy Backend is running!");
});

// 🚀 Start the server
app.listen(PORT, () => {
  console.log(`🚀 Backend server running at http://localhost:${PORT}`);
});
