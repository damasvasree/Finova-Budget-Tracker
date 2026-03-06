const router = require("express").Router();
const Income = require("../models/Income");

// add income
router.post("/", async (req, res) => {
  const income = new Income(req.body);
  const saved = await income.save();
  res.json(saved);
});

// get income
router.get("/", async (req, res) => {
  const data = await Income.find();
  res.json(data);
});

module.exports = router;