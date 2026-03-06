import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Register.css";

function Register() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    // Validation
    if (!name || !email || !password || !confirmPassword) {
      setError("Please fill in all fields");
      setIsLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      setIsLoading(false);
      return;
    }

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Store user in localStorage
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    
    // Check if email already exists
    if (users.find(u => u.email === email)) {
      setError("Email already registered");
      setIsLoading(false);
      return;
    }

    // Add new user
    users.push({ name, email, password });
    localStorage.setItem("users", JSON.stringify(users));

    setIsLoading(false);
    
    // Show success and redirect to login
    alert("Registration successful! Please login.");
    navigate("/login");
  };

  return (
    <div className="register-page">
      <div className="register-background">
        <div className="floating-shapes">
          <div className="shape shape-1"></div>
          <div className="shape shape-2"></div>
          <div className="shape shape-3"></div>
        </div>
      </div>
      
      <div className="register-container">
        <div className="register-card">
          <div className="register-header">
            <h1>Finova</h1>
            <p>Create your account</p>
          </div>

          <form onSubmit={handleRegister} className="register-form">
            {error && (
              <div className="error-message">
                <span>⚠</span> {error}
              </div>
            )}

            <div className="input-group">
              <input
                type="text"
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="register-input"
              />
            </div>

            <div className="input-group">
              <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="register-input"
              />
            </div>

            <div className="input-group">
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="register-input"
              />
            </div>

            <div className="input-group">
              <input
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="register-input"
              />
            </div>

            <button 
              type="submit" 
              className={`register-btn ${isLoading ? 'loading' : ''}`}
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="btn-text">
                  <span className="spinner"></span>
                  Creating Account...
                </span>
              ) : (
                <span className="btn-text">Create Account</span>
              )}
            </button>
          </form>

          <div className="register-footer">
            <p>Already have an account?</p>
            <Link to="/login" className="login-link">
              <span>Login</span>
              <span className="arrow">→</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;

