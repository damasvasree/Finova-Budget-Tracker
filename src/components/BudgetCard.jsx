import { useState } from "react";
import { useApp } from "../App";

function BudgetCard({ name, emoji, initialBudget, spentAmount = 0, onDelete }) {
  const { addExpense: addGlobalExpense } = useApp();
  const [budget] = useState(initialBudget);
  const [spent, setSpent] = useState(spentAmount);
  const [input, setInput] = useState("");

  // Use the passed spentAmount if provided, otherwise use local state
  const actualSpent = spentAmount > 0 ? spentAmount : spent;
  
  const percent = budget > 0 ? Math.min(Math.round((actualSpent / budget) * 100), 100) : 0;
  const remaining = budget - actualSpent;

  const handleAddExpense = () => {
    if (!input || Number(input) <= 0) return;
    const newSpent = Number(input);
    setSpent((prev) => prev + newSpent);
    
    // Also add to global expenses
    addGlobalExpense({
      amount: newSpent,
      category: name,
      description: "Added from Budget Card",
      date: new Date().toISOString()
    });
    
    setInput("");
  };

  const getStatus = () => {
    if (percent >= 100)
      return { label: "Over Budget", color: "#ff6b6b", bg: "rgba(255, 107, 107, 0.4)" };
    if (percent >= 86)
      return { label: "Critical", color: "#ffa502", bg: "rgba(255, 165, 2, 0.4)" };
    if (percent >= 61)
      return { label: "Moderate", color: "#ffd43b", bg: "rgba(255, 212, 59, 0.4)" };
    return { label: "Safe", color: "#26de81", bg: "rgba(38, 222, 129, 0.4)" };
  };

  const status = getStatus();

  return (
    <div className="glass-card">

      <div className="top-row">
        <div className="title">
          <span className="icon">{emoji}</span>
          <h3>{name}</h3>
        </div>

        <div className="card-actions">
          <span
            className="status-badge"
            style={{
              background: status.color + "20",
              color: status.color,
            }}
          >
            {status.label}
          </span>
          {onDelete && (
            <button onClick={onDelete} className="delete-btn" title="Delete Category">×</button>
          )}
        </div>
      </div>

      <div className="amount-row">

        <div>
          <p className="label">Spent</p>
          <h2>₹{actualSpent.toLocaleString()}</h2>
        </div>

        <div className="progress-ring">
          <svg width="80" height="80">
            <circle
              cx="40"
              cy="40"
              r="30"
              stroke="rgba(255, 255, 255, 0.3)"
              strokeWidth="8"
              fill="none"
            />
            <circle
              cx="40"
              cy="40"
              r="30"
              stroke={status.color}
              strokeWidth="8"
              fill="none"
              strokeDasharray={2 * Math.PI * 30}
              strokeDashoffset={
                2 * Math.PI * 30 * (1 - percent / 100)
              }
              strokeLinecap="round"
            />
          </svg>
          <span className="percent" style={{ color: status.color }}>{percent}%</span>
        </div>

        <div>
          <p className="label">Budget</p>
          <h2>₹{budget.toLocaleString()}</h2>
        </div>

      </div>

      <div className="bar">
        <div
          className="bar-fill"
          style={{
            width: percent + "%",
            background: status.color,
          }}
        />
      </div>

      <p className="remaining">
        {remaining >= 0
          ? `₹${remaining.toLocaleString()} left`
          : `Over by ₹${Math.abs(remaining).toLocaleString()}`}
      </p>

      {percent >= 86 && percent < 100 && (
        <div className="warning">
          ⚠ Only ₹{remaining.toLocaleString()} remaining
        </div>
      )}

      {percent >= 100 && (
        <div className="danger">
          🚨 Budget exceeded by ₹{Math.abs(remaining).toLocaleString()}
        </div>
      )}

      <div className="add-expense">
        <input
          type="number"
          placeholder="Add expense"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button onClick={handleAddExpense}>Add</button>
      </div>

    </div>
  );
}

export default BudgetCard;
