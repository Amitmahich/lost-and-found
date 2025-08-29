import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { auth, db } from "../firebase/config";
import "../styles/Auth.css";

export default function SignUp() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    mobile: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const validate = () => {
    const errors = [];

    if (!formData.firstName.trim()) errors.push("First name is required");
    if (!formData.lastName.trim()) errors.push("Last name is required");
    if (!formData.email) errors.push("Email is required");
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      errors.push("Invalid email address");
    if (!formData.mobile) errors.push("Mobile number is required");
    else if (!/^\d{10}$/.test(formData.mobile))
      errors.push("Mobile number must be 10 digits");
    if (!formData.password) errors.push("Password is required");
    else if (formData.password.length < 6)
      errors.push("Password must be at least 6 characters");
    if (!formData.confirmPassword) errors.push("Please confirm your password");
    else if (formData.password !== formData.confirmPassword)
      errors.push("Passwords do not match");

    if (errors.length > 0) {
      toast.error(errors[0]); // show first error
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );

      const user = userCredential.user;

      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        mobile: formData.mobile,
        createdAt: new Date(),
        isAdmin: false, // This is already present (default: normal user)
        isBlocked: false, // ✅ This is the new field added
        postCount: 0,
      });

      await sendEmailVerification(user);
      toast.success(
        "Account created! Please verify your email 📧. " +
          "Check your inbox or spam folder if you don't see it."
      );
      navigate("/signin");
    } catch (error) {
      if (error.code === "auth/email-already-in-use") {
        toast.error("Email already exists. Try signing in.");
      } else {
        toast.error(error.message || "Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>Join Us 🚀</h2>
        <p>Create your account to get started</p>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="First Name"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
          />
          <input
            type="text"
            placeholder="Last Name"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
          />
          <input
            type="email"
            placeholder="Email Address"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
          <input
            type="tel"
            placeholder="Mobile Number"
            name="mobile"
            value={formData.mobile}
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

          <div className="password-input-container">
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm Password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
            />
            <button
              type="button"
              className="show-password-btn"
              onClick={() => setShowConfirmPassword((prev) => !prev)}
            >
              {showConfirmPassword ? "Hide" : "Show"}
            </button>
          </div>

          <button type="submit" disabled={loading}>
            {loading ? "Creating Account..." : "Sign Up"}
          </button>
          <p className="switch-auth">
            Already have an account? <Link to="/signin">Sign In</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
