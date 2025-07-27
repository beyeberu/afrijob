import { useState, useEffect } from "react";
import {
  auth,
  signInWithEmailAndPassword,
} from "../firebase";
import {
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail,
} from "firebase/auth";
import { useNavigate } from "react-router-dom";
import "./Login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [emailHistory, setEmailHistory] = useState([]);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetMessage, setResetMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Load email history from localStorage
    const history = JSON.parse(localStorage.getItem("emailHistory") || "[]");
    setEmailHistory(history);
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const token = await userCredential.user.getIdToken();
      localStorage.setItem("token", token);

      // Save email to history if not already present
      let history = JSON.parse(localStorage.getItem("emailHistory") || "[]");
      if (email && !history.includes(email)) {
        history.push(email);
        localStorage.setItem("emailHistory", JSON.stringify(history));
        setEmailHistory(history);
      }

      navigate("/");
    } catch (err) {
      setError(getErrorMessage(err.code));
      console.error("Login error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError("");
    setLoading(true);
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const token = await result.user.getIdToken();
      localStorage.setItem("token", token);
      navigate("/");
    } catch (err) {
      setError("Google login failed. Please try again.");
      console.error("Google login error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    setResetMessage("");
    setError("");
    try {
      await sendPasswordResetEmail(auth, resetEmail || email);
      setResetMessage("Password reset email sent! Check your inbox.");
    } catch (err) {
      setError("Failed to send reset email. Please check the email address.");
      console.error("Password reset error:", err);
    }
  };

  const getErrorMessage = (code) => {
    switch (code) {
      case "auth/invalid-email":
        return "Invalid email address";
      case "auth/user-disabled":
        return "Account disabled";
      case "auth/user-not-found":
      case "auth/wrong-password":
        return "Invalid email or password";
      default:
        return "Login failed. Please try again.";
    }
  };

  return (
    <div className="login-form">
      <h2>Login</h2>
      {error && <div className="error">{error}</div>}
      {resetMessage && <div className="success">{resetMessage}</div>}
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          list="email-history"
        />
        <datalist id="email-history">
          {emailHistory.map((item, idx) => (
            <option value={item} key={idx} />
          ))}
        </datalist>
        <input
          type={showPassword ? "text" : "password"}
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <label className="show-password">
          <input
            type="checkbox"
            checked={showPassword}
            onChange={() => setShowPassword(!showPassword)}
          />
          Show Password
        </label> <br />
        <button type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
      <button
        type="button"
        className="google-login-btn"
        onClick={handleGoogleLogin}
        disabled={loading}
        style={{ marginTop: "1rem" }}
      >
        <img
          src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
          alt="Google"
          className="google-logo"
        />
        Continue with Google
      </button>
      <form onSubmit={handlePasswordReset} style={{ marginTop: "1rem" }}>
        <button type="submit" disabled={loading}>
          Forgot password?
        </button>
      </form>
    </div>
  );
}

export default Login;
