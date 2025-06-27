import { onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { signInWithEmailAndPassword } from "firebase/auth";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { auth } from "../firebase/config";
import "../styles/Auth.css";

export default function SignIn() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        navigate("/dashboard");
      }
    });

    return () => unsubscribe(); // cleanup
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const validate = () => {
    let err = {};
    if (!formData.email) {
      err.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      err.email = "Invalid email";
    }

    if (!formData.password) {
      err.password = "Password is required";
    }

    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      try {
        await signInWithEmailAndPassword(
          auth,
          formData.email,
          formData.password
        );
        toast.success("Signed in successfully ✅");
        console.log("✅ Login Success");
        navigate("/dashboard");
      } catch (error) {
        console.error("❌ Login Error", error);
        toast.error("Invalid credentials ❌");
      }
    } else {
      toast.error("Please fix the form ❌");
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
          {errors.email && <p className="error">{errors.email}</p>}

          <input
            type="password"
            placeholder="Password"
            name="password"
            value={formData.password}
            onChange={handleChange}
          />
          {errors.password && <p className="error">{errors.password}</p>}

          <div className="auth-links">
            <Link to="/forgot-password">Forgot Password?</Link>
          </div>

          <button type="submit">Sign In</button>

          <p className="switch-auth">
            Don’t have an account? <Link to="/signup">Sign Up</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
