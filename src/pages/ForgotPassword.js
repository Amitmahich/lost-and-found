import { sendPasswordResetEmail } from "firebase/auth";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { auth } from "../firebase/config";
import "../styles/Auth.css";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false); // ✅ New
  const navigate = useNavigate();

  const validate = () => {
    if (!email) return "Email is required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return "Invalid email";
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const error = validate();
    if (error) {
      toast.error(error);
      return;
    }

    setLoading(true); // ✅ Start loading

    try {
      await sendPasswordResetEmail(auth, email);
      toast.success("Reset email sent 📩");
      setTimeout(() => navigate("/signin"), 2000);
    } catch (err) {
      console.error("Reset error:", err.code);

      if (err.code === "auth/user-not-found") {
        toast.error("No account found with this email ❌");
      } else if (err.code === "auth/invalid-email") {
        toast.error("Invalid email format ❌");
      } else {
        toast.error("Failed to send reset email ❌");
      }
    } finally {
      setLoading(false); // ✅ Stop loading
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
            onChange={(e) => setEmail(e.target.value)}
          />

          <button type="submit" disabled={loading}>
            {loading ? "Sending Reset Email..." : "Reset Password"}
          </button>
        </form>
      </div>
    </div>
  );
}
