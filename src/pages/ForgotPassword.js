import { sendPasswordResetEmail } from "firebase/auth";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { auth } from "../firebase/config";
import "../styles/Auth.css";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate(); // ⬅️ for redirect

  const validate = () => {
    if (!email) return "Email is required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return "Invalid email";
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const err = validate();
    if (err) {
      setError(err);
      toast.error("Please enter a valid email");
    } else {
      try {
        await sendPasswordResetEmail(auth, email);
        toast.success("Reset email sent 📩");
        setTimeout(() => navigate("/signin"), 2000); // ⬅️ Redirect after 2 sec
      } catch (error) {
        console.error("Reset error:", error.message);
        toast.error("Email not found or invalid ❌");
      }
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>Forgot Password 🔒</h2>
        <p>Enter your registered email to reset your password</p>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setError("");
            }}
          />
          {error && <p className="error">{error}</p>}

          <button type="submit">Reset Password</button>
        </form>
      </div>
    </div>
  );
}
