import { Routes, Route, Link, Navigate } from "react-router-dom";
import { useState, useEffect, createContext, useContext } from "react";
import Login from "./components/Login";
import Register from "./components/Register";
import Dashboard from "./components/Dashboard";
import Analytics from "./components/Analytics";
import BudgetPlanner from "./components/BudgetPlanner";
import AddExpenseModal from "./components/AddExpenseModal";
import "./App.css";

// Create Context for global state management
export const AppContext = createContext();

export const useApp = () => useContext(AppContext);

function App() {
  // Clear any existing session on app load to start fresh at login
  // Remove this line after first run if you want persistent login
  const [income, setIncome] = useState(() => {
    const saved = localStorage.getItem("income");
    return saved ? Number(saved) : 0;
  });
  
  const [expenses, setExpenses] = useState(() => {
    const saved = localStorage.getItem("expenses");
    return saved ? JSON.parse(saved) : [];
  });

  // Always start with false to force login - remove this comment after testing
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Persist data to localStorage
  useEffect(() => {
    localStorage.setItem("income", income.toString());
  }, [income]);

  useEffect(() => {
    localStorage.setItem("expenses", JSON.stringify(expenses));
  }, [expenses]);

  useEffect(() => {
    localStorage.setItem("isLoggedIn", isAuthenticated.toString());
  }, [isAuthenticated]);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("isLoggedIn");
  };

  const addExpense = (expense) => {
    setExpenses([...expenses, { ...expense, id: Date.now() }]);
  };

  const contextValue = {
    income,
    setIncome,
    expenses,
    setExpenses,
    addExpense,
    isAuthenticated,
    handleLogin,
    handleLogout
  };

  return (
    <AppContext.Provider value={contextValue}>
      {/* Background Video */}
      <video autoPlay muted loop playsInline className="bg-video">
        <source src="/bg.mp4" type="video/mp4" />
      </video>

      <div className="glass-app">

        {/* Navigation - Only show when authenticated */}
        {isAuthenticated && (
          <nav className="navbar">
            <h2>Finova</h2>
            <div>
              <Link to="/dashboard">Dashboard</Link>
              <Link to="/budget">Budget</Link>
              <Link to="/analytics">Analytics</Link>
              <button onClick={handleLogout} className="nav-logout">Logout</button>
            </div>
          </nav>
        )}

        {/* Routes */}
        <Routes>
          <Route path="/register" element={
            isAuthenticated ? <Navigate to="/dashboard" /> : <Register />
          } />
          <Route path="/login" element={
            isAuthenticated ? <Navigate to="/dashboard" /> : <Login />
          } />
          <Route path="/" element={
            isAuthenticated ? <Navigate to="/dashboard" /> : <Navigate to="/login" />
          } />
          <Route path="/dashboard" element={
            isAuthenticated ? <Dashboard /> : <Navigate to="/login" />
          } />
          <Route path="/budget" element={
            isAuthenticated ? <BudgetPlanner /> : <Navigate to="/login" />
          } />
          <Route path="/analytics" element={
            isAuthenticated ? <Analytics /> : <Navigate to="/login" />
          } />
          <Route path="/add-expense" element={
            isAuthenticated ? <AddExpenseModal /> : <Navigate to="/login" />
          } />
        </Routes>

      </div>
    </AppContext.Provider>
  );
}

export default App;
