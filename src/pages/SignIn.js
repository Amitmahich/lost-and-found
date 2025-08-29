import { onAuthStateChanged, signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { auth, db } from "../firebase/config";
import "../styles/Auth.css";

export default function SignIn() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // ✅ Auto redirect if already logged in
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user && user.emailVerified) {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          if (userData.isAdmin === true) {
            // toast.success("Welcome back Admin 👑");
            navigate("/admin");
          } else {
            // toast.success("Signed in successfully ✅");
            navigate("/dashboard");
          }
        }
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const validate = () => {
    if (!formData.email) {
      toast.error("Email is required ❌");
      return false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      toast.error("Invalid email address ❌");
      return false;
    }

    if (!formData.password) {
      toast.error("Password is required ❌");
      return false;
    } else if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters ❌");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );

      const user = userCredential.user;

      if (!user.emailVerified) {
        toast.error(
          "Please verify your email before signing in ❌. Please check your inbox or spam folder."
        );
        return;
      }

      // ✅ Firestore role check
      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();

        if (userData.isAdmin === true) {
          toast.success("Welcome Admin 👑");
          navigate("/admin");
        } else {
          toast.success("Signed in successfully ✅");
          navigate("/dashboard");
        }
      } else {
        toast.error("User record not found ❌");
      }
    } catch (error) {
      console.error("❌ Login Error", error);
      toast.error("Invalid email or password ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>Welcome Back 👋</h2>
        <p>Sign in to continue</p>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email address"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />

          <div className="password-input-container">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              name="password"
              value={formData.password}
              onChange={handleChange}
            />
            <button
              type="button"
              className="show-password-btn"
              onClick={() => setShowPassword((prev) => !prev)}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>

          <div className="auth-links">
            <Link to="/forgot-password">Forgot Password?</Link>
          </div>

          <button type="submit" disabled={loading}>
            {loading ? "Signing In..." : "Sign In"}
          </button>

          <p className="switch-auth">
            Don’t have an account? <Link to="/signup">Sign Up</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
