import { signOut } from "firebase/auth";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { auth } from "../firebase/config";
import "../styles/DashboardNavbar.css";

export default function DashboardNavbar() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      toast.success("Signed out successfully");
      navigate("/signin");
    } catch (error) {
      toast.error("Failed to sign out");
    }
  };

  return (
    <nav className="dashboard-navbar">
      <div className="navbar-logo" onClick={() => navigate("/dashboard")}>
        Lost & Found
      </div>

      <div className={`navbar-links ${isOpen ? "active" : ""}`}>
        <Link to="/dashboard/post-item">Post Item</Link>
        <Link to="/dashboard">Feed</Link>
        <Link to="/dashboard/responses">Responses</Link>
        <Link to="/dashboard/my-listings">My Listings</Link>
        <button className="signout-btn" onClick={handleSignOut}>
          Sign Out
        </button>
      </div>

      <div className="hamburger" onClick={() => setIsOpen(!isOpen)}>
        <div className={`bar ${isOpen ? "rotate1" : ""}`}></div>
        <div className={`bar ${isOpen ? "fade" : ""}`}></div>
        <div className={`bar ${isOpen ? "rotate2" : ""}`}></div>
      </div>
    </nav>
  );
}
