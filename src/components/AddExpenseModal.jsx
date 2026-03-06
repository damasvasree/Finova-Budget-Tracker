import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useApp } from "../App";
import "../App.css";

export default function AddExpenseModal() {
  const navigate = useNavigate();
  const { addExpense, expenses } = useApp();
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");

  const handleAdd = () => {
    if (!amount || !category) {
      alert("Please enter amount and select category");
      return;
    }

    const newExpense = {
      amount: Number(amount),
      category,
      description,
      date: new Date().toISOString()
    };

    addExpense(newExpense);
    alert(`Expense Added: ₹${amount} for ${category}`);
    navigate("/dashboard");
  };

  const handleCancel = () => {
    navigate("/dashboard");
  };

  return (
    <div className="addexpense-page">
      <div className="addexpense-card">
        <h1 className="addexpense-title">Add Expense</h1>

        <input
          type="number"
          placeholder="Enter Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="addexpense-input"
        />

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="addexpense-input"
        >
          <option value="">Select Category</option>
          <option value="Food">Food</option>
          <option value="Transport">Transport</option>
          <option value="Shopping">Shopping</option>
          <option value="Health">Health</option>
          <option value="Education">Education</option>
          <option value="Entertainment">Entertainment</option>
          <option value="Utilities">Utilities</option>
          <option value="Other">Other</option>
        </select>

        <input
          type="text"
          placeholder="Description (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="addexpense-input"
        />

        <div className="addexpense-buttons">
          <button onClick={handleAdd} className="btn primary">
            Add Expense
          </button>

          <button onClick={handleCancel} className="btn danger">
            Cancel
          </button>
        </div>

        <Link to="/dashboard" className="back-link">← Back to Dashboard</Link>
      </div>
    </div>
  );
}
