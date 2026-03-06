import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useApp } from "../App";
import "../App.css";

export default function Dashboard() {
  const navigate = useNavigate();
  const { income, setIncome, expenses, isAuthenticated } = useApp();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    if (!isLoggedIn) {
      navigate("/");
    } else {
      setIsLoaded(true);
    }
  }, [navigate]);

  if (!isLoaded || !isAuthenticated) return null;

  const totalExpense = expenses.reduce(
    (sum, item) => sum + Number(item.amount),
    0
  );

  const savings = income - totalExpense;

  const handleIncomeChange = () => {
    const newIncome = prompt("Enter your monthly income:");
    if (newIncome && !isNaN(Number(newIncome)) && Number(newIncome) > 0) {
      setIncome(Number(newIncome));
      localStorage.setItem("income", newIncome);
    } else if (newIncome) {
      alert("Please enter a valid number");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    navigate("/");
  };

  return (
    <div className="dashboard-container">

      <div className="dashboard-header">
        <h1>Finova</h1>
        <p className="subtitle">Smart Expense & Budget Manager</p>
        <button onClick={handleLogout} className="btn logout-btn">Logout</button>
      </div>

      <div className="stats-grid">

        <div className="stat-card income" onClick={handleIncomeChange} style={{cursor: 'pointer'}}>
          <h3>Total Income (Click to Edit)</h3>
          <h2>₹{income.toLocaleString()}</h2>
        </div>

        <div className="stat-card expense">
          <h3>Total Expense</h3>
          <h2>₹{totalExpense.toLocaleString()}</h2>
        </div>

        <div className="stat-card savings">
          <h3>Savings</h3>
          <h2
            style={{
              color: savings < 0 ? "#ff4d4d" : "#00ff99"
            }}
          >
            ₹{savings.toLocaleString()}
          </h2>
        </div>

      </div>

      <div className="action-buttons">
        <Link to="/budget" className="btn">Budget Planner</Link>
        <Link to="/analytics" className="btn">Analytics</Link>
        <Link to="/add-expense" className="btn primary">Add Expense</Link>
      </div>

    </div>
  );
}
