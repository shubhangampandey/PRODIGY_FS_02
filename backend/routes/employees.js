const express = require("express");
const { body, validationResult } = require("express-validator");
const Employee = require("../models/Employee");
const authMiddleware = require("../middleware/auth");

const router = express.Router();
router.use(authMiddleware);

const employeeValidation = [
  body("name").trim().notEmpty().withMessage("Name required").isLength({ max: 100 }),
  body("email").trim().isEmail().withMessage("Valid email required").isLength({ max: 255 }),
  body("phone").trim().isLength({ min: 7, max: 15 }).withMessage("Phone 7-15 digits").isNumeric().withMessage("Phone must be numeric"),
  body("role").trim().notEmpty().withMessage("Role required").isLength({ max: 100 }),
  body("department").isIn(["Engineering", "Marketing", "Sales", "HR", "Finance", "Operations", "Design", "Support"]).withMessage("Invalid department"),
  body("salary").isFloat({ min: 1, max: 10000000 }).withMessage("Salary 1-10,000,000"),
  body("joiningDate").notEmpty().withMessage("Joining date required"),
];

// GET /api/employees
router.get("/", async (req, res) => {
  try {
    const employees = await Employee.find().sort({ createdAt: -1 });
    res.json(employees);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch employees" });
  }
});

// GET /api/employees/:id
router.get("/:id", async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) return res.status(404).json({ message: "Employee not found" });
    res.json(employee);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch employee" });
  }
});

// POST /api/employees
router.post("/", employeeValidation, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    const employee = await Employee.create(req.body);
    res.status(201).json(employee);
  } catch (error) {
    res.status(500).json({ message: "Failed to create employee" });
  }
});

// PUT /api/employees/:id
router.put("/:id", employeeValidation, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    const employee = await Employee.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!employee) return res.status(404).json({ message: "Employee not found" });
    res.json(employee);
  } catch (error) {
    res.status(500).json({ message: "Failed to update employee" });
  }
});

// DELETE /api/employees/:id
router.delete("/:id", async (req, res) => {
  try {
    const employee = await Employee.findByIdAndDelete(req.params.id);
    if (!employee) return res.status(404).json({ message: "Employee not found" });
    res.json({ message: "Employee deleted" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete employee" });
  }
});

module.exports = router;
