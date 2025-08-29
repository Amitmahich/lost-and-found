// src/components/admin/AdminNavbar.jsx
import { signOut } from "firebase/auth"; // ✅ Firebase signOut
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import notificationSound from "../../assets/notification.mp3";
import { auth, db } from "../../firebase/config"; // ✅ auth imported
import "../../styles/AdminNavbar.css";

export default function AdminNavbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [unhandledCount, setUnhandledCount] = useState(0);
  const menuRef = useRef(null);
  const buttonRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();

  const prevCountRef = useRef(0);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const q = query(collection(db, "reports"), where("isHandled", "==", false));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const newCount = snapshot.size;
        setUnhandledCount(newCount);

        if (
          newCount > prevCountRef.current &&
          location.pathname !== "/admin/reports"
        ) {
          const audio = new Audio(notificationSound);
          audio.play().catch(() => {});
        }

        prevCountRef.current = newCount;
      },
      (error) => {
        console.error("Error fetching reports:", error);
      }
    );

    return () => unsubscribe();
  }, [location.pathname]);

  const isActive = (path) => location.pathname === path;

  // ✅ Sign Out Function
  const handleSignOut = () => {
    const confirmLogout = window.confirm("Are you sure you want to log out?");
    if (confirmLogout) {
      signOut(auth)
        .then(() => {
          navigate("/login"); // redirect after sign out
        })
        .catch((error) => {
          console.error("Sign out error:", error);
        });
    }
  };

  return (
    <nav className="admin-navbar">
      <h2
        className="logo"
        onClick={() => navigate("/admin")}
        style={{ cursor: "pointer" }}
      >
        Admin Panel
      </h2>

      <div
        ref={buttonRef}
        className={`hamburger ${isOpen ? "active" : ""}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        ☰
      </div>

      <ul ref={menuRef} className={`nav-links ${isOpen ? "open" : ""}`}>
        <li className={isActive("/admin/items") ? "active" : ""}>
          <Link to="/admin/items">All Items</Link>
        </li>
        <li className={isActive("/admin/users") ? "active" : ""}>
          <Link to="/admin/users">All Users</Link>
        </li>
        <li
          className={`nav-item ${isActive("/admin/reports") ? "active" : ""}`}
        >
          <Link to="/admin/reports" className="nav-link-with-badge">
            Reports & Notifications
            {unhandledCount > 0 && (
              <span className="notification-badge">{unhandledCount}</span>
            )}
          </Link>
        </li>
        <li className={isActive("/admin/blocked") ? "active" : ""}>
          <Link to="/admin/blocked">Blocked Users</Link>
        </li>

        {/* ✅ Sign Out Option */}
        <li>
          <button
            onClick={handleSignOut}
            className="signout-button"
            style={{
              background: "#ff4d4f",
              color: "#fff",
              border: "none",
              padding: "0.4rem 0.8rem",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            Sign Out
          </button>
        </li>
      </ul>
    </nav>
  );
}
