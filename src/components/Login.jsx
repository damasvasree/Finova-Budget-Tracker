import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useApp } from "../App";
import "./Login.css";

function Login() {
  const navigate = useNavigate();
  const { handleLogin } = useApp();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLoginClick = async () => {
    setError("");

    if (!email || !password) {
      setError("Please enter both email and password");
      return;
    }

    setIsLoading(true);

    // Simulate loading
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Check against registered users
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const user = users.find(u => u.email === email && u.password === password);

    if (user) {
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("currentUser", JSON.stringify(user));
      handleLogin();
      navigate("/dashboard");
    } else {
      setError("Invalid email or password");
    }

    setIsLoading(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleLoginClick();
    }
  };

  return (
    <div className="login-page">
      <div className="login-background">
        <div className="floating-shapes">
          <div className="shape shape-1"></div>
          <div className="shape shape-2"></div>
          <div className="shape shape-3"></div>
        </div>
      </div>
      
      <div className="login-container">
        <div className="login-card">
          <div className="login-header">
            <h1>Finova</h1>
            <p>Welcome back! Please login</p>
          </div>

          {error && (
            <div className="error-message">
              <span>⚠</span> {error}
            </div>
          )}

          <div className="login-form">
            <div className="input-group">
              <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyPress={handleKeyPress}
                className="login-input"
              />
            </div>

            <div className="input-group">
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={handleKeyPress}
                className="login-input"
              />
            </div>

            <button 
              onClick={handleLoginClick} 
              className={`login-btn ${isLoading ? 'loading' : ''}`}
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="btn-text">
                  <span className="spinner"></span>
                  Logging in...
                </span>
              ) : (
                <span className="btn-text">Login</span>
              )}
            </button>
          </div>

          <div className="login-footer">
            <p>Don't have an account?</p>
            <Link to="/register" className="register-link">
              <span>Create Account</span>
              <span className="arrow">→</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;

