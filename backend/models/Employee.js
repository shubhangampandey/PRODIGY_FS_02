const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 100 },
    email: { type: String, required: true, trim: true, lowercase: true, maxlength: 255 },
    phone: { type: String, required: true, trim: true, minlength: 7, maxlength: 15 },
    role: { type: String, required: true, trim: true, maxlength: 100 },
    department: {
      type: String,
      required: true,
      enum: ["Engineering", "Marketing", "Sales", "HR", "Finance", "Operations", "Design", "Support"],
    },
    salary: { type: Number, required: true, min: 1, max: 10000000 },
    joiningDate: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Employee", employeeSchema);
