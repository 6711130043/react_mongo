const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
app.use(cors());
// �� connect MongoDB
mongoose
  .connect("mongodb://localhost:27017/MUT")
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));
// �� Schema
const employeeSchema = new mongoose.Schema({
  name: String,
  age: Number,

  address: {
    street: String,
    city: String,
    zip: String,
  },
  hobby: [String],
  tel: [String],
});
// �� Model
const Employee = mongoose.model("employee", employeeSchema, "employee");
// ✅ API: GET employee
app.get("/api/employees", async (req, res) => {
  try {
    const data = await Employee.find();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// ▶️ run server
app.listen(5000, () => {
  console.log("Server running at http://localhost:5000");
});
