const router = require("express").Router();
const Expense = require("../models/Expense");

// add expense
router.post("/", async (req, res) => {
  const expense = new Expense(req.body);
  const saved = await expense.save();
  res.json(saved);
});

// get all expenses
router.get("/", async (req, res) => {
  const data = await Expense.find();
  res.json(data);
});

module.exports = router;