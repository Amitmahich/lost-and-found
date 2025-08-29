// // src/components/DashboardNavbar.js
// import { onAuthStateChanged, signOut } from "firebase/auth";
// import { collection, onSnapshot, query, where } from "firebase/firestore";
// import { useEffect, useRef, useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { toast } from "react-toastify";
// import notificationSound from "../assets/notification.mp3";
// import { auth, db } from "../firebase/config";
// import "../styles/DashboardNavbar.css";

// export default function DashboardNavbar() {
//   const [isOpen, setIsOpen] = useState(false);
//   const [unreadCount, setUnreadCount] = useState(0);
//   const [currentUser, setCurrentUser] = useState(null);
//   const navigate = useNavigate();
//   const audioRef = useRef(new Audio(notificationSound));
//   const previousCountRef = useRef(0);

//   useEffect(() => {
//     const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
//       setCurrentUser(user);

//       if (user) {
//         const q = query(
//           collection(db, "notifications"),
//           where("userId", "==", user.uid),
//           where("read", "==", false)
//         );

//         const unsubscribeSnapshot = onSnapshot(q, (snapshot) => {
//           const newCount = snapshot.size;

//           if (newCount > previousCountRef.current) {
//             audioRef.current
//               .play()
//               .catch((err) =>
//                 console.warn("Audio play blocked by browser", err)
//               );
//           }

//           previousCountRef.current = newCount;
//           setUnreadCount(newCount);
//         });

//         return () => unsubscribeSnapshot();
//       }
//     });

//     return () => unsubscribeAuth();
//   }, []);

//   const handleSignOut = async () => {
//     const confirmLogout = window.confirm("Are you sure you want to sign out?");
//     if (!confirmLogout) return; // User cancelled

//     try {
//       await signOut(auth);
//       toast.success("Signed out successfully ✅");
//       navigate("/signin");
//     } catch (error) {
//       toast.error("Failed to sign out ❌");
//     }
//   };

//   return (
//     <nav className="dashboard-navbar">
//       <div className="navbar-logo" onClick={() => navigate("/dashboard")}>
//         Lost & Found
//       </div>

//       <div className={`navbar-links ${isOpen ? "active" : ""}`}>
//         <Link to="/dashboard/post-item">Post Item</Link>
//         <Link to="/dashboard">Feed</Link>
//         <Link to="/dashboard/responses">Responses</Link>
//         <Link to="/dashboard/my-listings">My Listings</Link>
//         <Link to="/dashboard/notifications" className="notification-icon">
//           🔔
//           {unreadCount > 0 && <span className="badge-dot">{unreadCount}</span>}
//         </Link>
//         <button className="signout-btn" onClick={handleSignOut}>
//           Sign Out
//         </button>
//       </div>

//       <div className="hamburger" onClick={() => setIsOpen(!isOpen)}>
//         <div className={`bar ${isOpen ? "rotate1" : ""}`}></div>
//         <div className={`bar ${isOpen ? "fade" : ""}`}></div>
//         <div className={`bar ${isOpen ? "rotate2" : ""}`}></div>
//       </div>
//     </nav>
//   );
// }

// src/components/DashboardNavbar.js
import { onAuthStateChanged, signOut } from "firebase/auth";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import notificationSound from "../assets/notification.mp3";
import { auth, db } from "../firebase/config";
import "../styles/DashboardNavbar.css";

export default function DashboardNavbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();
  const audioRef = useRef(new Audio(notificationSound));
  const previousCountRef = useRef(0);
  const navbarRef = useRef(null);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);

      if (user) {
        const q = query(
          collection(db, "notifications"),
          where("userId", "==", user.uid),
          where("read", "==", false)
        );

        const unsubscribeSnapshot = onSnapshot(q, (snapshot) => {
          const newCount = snapshot.size;

          if (newCount > previousCountRef.current) {
            audioRef.current
              .play()
              .catch((err) =>
                console.warn("Audio play blocked by browser", err)
              );
          }

          previousCountRef.current = newCount;
          setUnreadCount(newCount);
        });

        return () => unsubscribeSnapshot();
      }
    });

    return () => unsubscribeAuth();
  }, []);

  // Close hamburger when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (navbarRef.current && !navbarRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const handleSignOut = async () => {
    const confirmLogout = window.confirm("Are you sure you want to sign out?");
    if (!confirmLogout) return; // User cancelled

    try {
      await signOut(auth);
      toast.success("Signed out successfully ✅");
      navigate("/signin");
    } catch (error) {
      toast.error("Failed to sign out ❌");
    }
  };

  return (
    <nav className="dashboard-navbar" ref={navbarRef}>
      <div className="navbar-logo" onClick={() => navigate("/dashboard")}>
        Lost & Found
      </div>

      <div className={`navbar-links ${isOpen ? "active" : ""}`}>
        <Link to="/dashboard/post-item">Post Item</Link>
        <Link to="/dashboard">Feed</Link>
        <Link to="/dashboard/responses">Responses</Link>
        <Link to="/dashboard/my-listings">My Listings</Link>
        <Link to="/dashboard/notifications" className="notification-icon">
          🔔
          {unreadCount > 0 && <span className="badge-dot">{unreadCount}</span>}
        </Link>
        <button className="signout-btn" onClick={handleSignOut}>
          Sign Out
        </button>
      </div>

      <div
        className="hamburger"
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
      >
        <div className={`bar ${isOpen ? "rotate1" : ""}`}></div>
        <div className={`bar ${isOpen ? "fade" : ""}`}></div>
        <div className={`bar ${isOpen ? "rotate2" : ""}`}></div>
      </div>
    </nav>
  );
}
