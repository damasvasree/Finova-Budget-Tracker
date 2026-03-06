const mongoose = require("mongoose");

const IncomeSchema = new mongoose.Schema({
  amount: Number,
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Income", IncomeSchema);