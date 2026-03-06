import { useState } from "react";
import { Link } from "react-router-dom";
import BudgetCard from "./BudgetCard";
import { useApp } from "../App";

function BudgetPlanner() {
  const { income, expenses } = useApp();
  const [categories, setCategories] = useState([
    { id: 1, name: "Housing", emoji: "🏠", budget: 15000 },
    { id: 2, name: "Food", emoji: "🍜", budget: 8000 },
    { id: 3, name: "Transport", emoji: "🚇", budget: 5000 },
  ]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [newCategory, setNewCategory] = useState({ name: "", emoji: "💰", budget: 0 });

  const handleAddCategory = () => {
    if (!newCategory.name || newCategory.budget <= 0) {
      alert("Please enter a valid name and budget");
      return;
    }

    const category = {
      id: Date.now(),
      name: newCategory.name,
      emoji: newCategory.emoji,
      budget: Number(newCategory.budget)
    };

    setCategories([...categories, category]);
    setNewCategory({ name: "", emoji: "💰", budget: 0 });
    setShowAddForm(false);
  };

  const handleDeleteCategory = (id) => {
    setCategories(categories.filter(cat => cat.id !== id));
  };

  // Calculate total spent per category from expenses
  const getSpentAmount = (categoryName) => {
    return expenses
      .filter(exp => exp.category === categoryName)
      .reduce((sum, exp) => sum + Number(exp.amount), 0);
  };

  return (
    <div className="page-container">
      <div className="budget-header">
        <h1>Budget Planner</h1>
        <Link to="/dashboard" className="btn">← Back to Dashboard</Link>
      </div>

      <div className="budget-summary">
        <p>Monthly Income: <strong>₹{income.toLocaleString()}</strong></p>
        <p>Total Budget Allocated: <strong>₹{categories.reduce((sum, cat) => sum + cat.budget, 0).toLocaleString()}</strong></p>
        <p>Remaining: <strong>₹{(income - categories.reduce((sum, cat) => sum + cat.budget, 0)).toLocaleString()}</strong></p>
      </div>

      <div className="budget-grid">
        {categories.map((cat) => (
          <BudgetCard
            key={cat.id}
            name={cat.name}
            emoji={cat.emoji}
            initialBudget={cat.budget}
            spentAmount={getSpentAmount(cat.name)}
            onDelete={() => handleDeleteCategory(cat.id)}
          />
        ))}
      </div>

      {!showAddForm ? (
        <button onClick={() => setShowAddForm(true)} className="add-category-btn">
          + Add Category
        </button>
      ) : (
        <div className="add-category-form">
          <h3>Add New Category</h3>
          <input
            type="text"
            placeholder="Category Name"
            value={newCategory.name}
            onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
          />
          <select
            value={newCategory.emoji}
            onChange={(e) => setNewCategory({ ...newCategory, emoji: e.target.value })}
          >
            <option value="💰">💰 Money</option>
            <option value="🏠">🏠 Housing</option>
            <option value="🍜">🍜 Food</option>
            <option value="🚇">🚇 Transport</option>
            <option value="🎬">🎬 Entertainment</option>
            <option value="🛒">🛒 Shopping</option>
            <option value="🏥">🏥 Health</option>
            <option value="📚">📚 Education</option>
            <option value="✈️">✈️ Travel</option>
            <option value="💡">💡 Utilities</option>
          </select>
          <input
            type="number"
            placeholder="Budget Amount"
            value={newCategory.budget || ""}
            onChange={(e) => setNewCategory({ ...newCategory, budget: e.target.value })}
          />
          <div className="form-buttons">
            <button onClick={handleAddCategory} className="btn primary">Add</button>
            <button onClick={() => setShowAddForm(false)} className="btn danger">Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default BudgetPlanner;
