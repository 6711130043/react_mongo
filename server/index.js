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

const superstoreSchema = new mongoose.Schema({
  "Row ID": Number,
  "Order ID": String,
  "Order Date": Date,
  "Ship Date": Date,
  "Ship Mode": String,
  "Customer ID": String,
  "Customer Name": String,
  Segment: String,
  City: String,
  State: String,
  "Country/Region": String,
  Region: String,
  "Product ID": String,
  Category: String,
  "Sub-Category": String,
  "Product Name": String,
  Sales: Number,
  Quantity: Number,
  Discount: Number,
  Profit: Number,
});

// �� Model
const Employee = mongoose.model("employee", employeeSchema, "employee");
const Superstore = mongoose.model("superstore", superstoreSchema, "superstore");

// ✅ API: GET employee
app.get("/api/employees", async (req, res) => {
  try {
    const data = await Employee.find();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/superstores", async (req, res) => {
  try {
    const data = await Superstore.find(
      {
        "Country/Region": "Thailand",
      },
      {
        _id: 0,
        "Order Date": 1,
        "Order ID": 1,
        "Customer ID": 1,
        "Customer Name": 1,
        City: 1,
        "Country/Region": 1,
        Sales: 1,
      },
    );
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ▶️ run server
app.listen(5000, () => {
  console.log("Server running at http://localhost:5000");
});
