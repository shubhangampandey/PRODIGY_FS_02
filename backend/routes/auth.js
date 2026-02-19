const express = require("express");
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");
const Admin = require("../models/Admin");

const router = express.Router();

// Seed default admin on first request if none exists
let seeded = false;
const seedAdmin = async () => {
  if (seeded) return;
  seeded = true;
  const exists = await Admin.findOne({ email: "admin@company.com" });
  if (!exists) {
    await Admin.create({ email: "admin@company.com", password: "admin123", name: "Admin" });
    console.log("Default admin created: admin@company.com / admin123");
  }
};

// POST /api/auth/login
router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Valid email required"),
    body("password").notEmpty().withMessage("Password required"),
  ],
  async (req, res) => {
    try {
      await seedAdmin();

      const errors = validationResult(req);
      if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

      const { email, password } = req.body;
      const admin = await Admin.findOne({ email: email.toLowerCase() });
      if (!admin || !(await admin.comparePassword(password))) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const token = jwt.sign({ id: admin._id, email: admin.email }, process.env.JWT_SECRET, { expiresIn: "8h" });

      res.json({ token, admin: { email: admin.email, name: admin.name } });
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  }
);

// POST /api/auth/signup
router.post(
  "/signup",
  [
    body("name").trim().notEmpty().withMessage("Name is required").isLength({ max: 100 }),
    body("email").isEmail().withMessage("Valid email required").normalizeEmail(),
    body("password")
      .isLength({ min: 8 }).withMessage("Password must be at least 8 characters")
      .matches(/[A-Z]/).withMessage("Password must contain an uppercase letter")
      .matches(/\d/).withMessage("Password must contain a number"),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) return res.status(400).json({ message: errors.array()[0].msg });

      const { name, email, password } = req.body;

      const existing = await Admin.findOne({ email: email.toLowerCase() });
      if (existing) {
        return res.status(409).json({ message: "Email already registered" });
      }

      const admin = await Admin.create({ name, email: email.toLowerCase(), password });

      const token = jwt.sign({ id: admin._id, email: admin.email }, process.env.JWT_SECRET, { expiresIn: "8h" });

      res.status(201).json({ token, admin: { email: admin.email, name: admin.name } });
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  }
);

module.exports = router;
