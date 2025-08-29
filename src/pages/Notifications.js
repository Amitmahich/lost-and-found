// // src/pages/Notifications.js
// import {
//   collection,
//   doc,
//   getDocs,
//   query,
//   updateDoc,
//   where,
// } from "firebase/firestore";
// import { useEffect, useState } from "react";
// import { auth, db } from "../firebase/config";
// import "../styles/Notifications.css";

// export default function Notifications() {
//   const [notifications, setNotifications] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchNotifications = async () => {
//       const user = auth.currentUser;
//       if (!user) return;

//       try {
//         const q = query(
//           collection(db, "notifications"),
//           where("userId", "==", user.uid)
//         );

//         const snapshot = await getDocs(q);
//         const result = snapshot.docs.map((doc) => ({
//           id: doc.id,
//           ...doc.data(),
//         }));

//         const sortedResult = result.sort(
//           (a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0)
//         );

//         setNotifications(sortedResult);

//         for (const note of sortedResult) {
//           if (!note.read) {
//             await updateDoc(doc(db, "notifications", note.id), {
//               read: true,
//             });
//           }
//         }
//       } catch (err) {
//         console.error("Error fetching notifications:", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchNotifications();
//   }, []);

//   const formatTimestamp = (timestamp) => {
//     if (!timestamp?.seconds) return "Just now";
//     const date = new Date(timestamp.seconds * 1000);
//     return date.toLocaleString();
//   };

//   if (loading) return <p className="loader">Loading notifications...</p>;

//   return (
//     <div className="notifications-container">
//       <h2>🔔 Your Notifications</h2>
//       {notifications.length === 0 ? (
//         <p>No notifications yet.</p>
//       ) : (
//         <ul className="notifications-list">
//           {notifications.map((note) => (
//             <li
//               key={note.id}
//               className={`notification-card glass ${
//                 note.itemType === "Lost it"
//                   ? "lost"
//                   : note.itemType === "Found it"
//                   ? "found"
//                   : ""
//               }`}
//             >
//               <p>{note.message}</p>
//               <span className="timestamp">
//                 {formatTimestamp(note.createdAt)}
//               </span>
//             </li>
//           ))}
//         </ul>
//       )}
//     </div>
//   );
// }


import {
  collection,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // ✅ added
import { auth, db } from "../firebase/config";
import "../styles/Notifications.css";

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); // ✅ added

  useEffect(() => {
    const fetchNotifications = async () => {
      const user = auth.currentUser;
      if (!user) return;

      try {
        const q = query(
          collection(db, "notifications"),
          where("userId", "==", user.uid)
        );

        const snapshot = await getDocs(q);
        const result = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        const sortedResult = result.sort(
          (a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0)
        );

        setNotifications(sortedResult);

        // Mark unread notifications as read
        for (const note of sortedResult) {
          if (!note.read) {
            await updateDoc(doc(db, "notifications", note.id), {
              read: true,
            });
          }
        }
      } catch (err) {
        console.error("Error fetching notifications:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  const formatTimestamp = (timestamp) => {
    if (!timestamp?.seconds) return "Just now";
    const date = new Date(timestamp.seconds * 1000);
    return date.toLocaleString();
  };

  if (loading) return <p className="loader">Loading notifications...</p>;

  return (
    <div className="notifications-container">
      <h2>🔔 Your Notifications</h2>
      {notifications.length === 0 ? (
        <p>No notifications yet.</p>
      ) : (
        <ul className="notifications-list">
          {notifications.map((note) => (
            <li
              key={note.id}
              className={`notification-card glass ${
                note.itemType === "Lost it"
                  ? "lost"
                  : note.itemType === "Found it"
                  ? "found"
                  : ""
              } ${!note.read ? "unread" : ""}`} // ✅ highlight unread
              onClick={() => navigate(`/dashboard/item/${note.itemId}`)} // ✅ clickable
              style={{ cursor: "pointer" }}
            >
              <p
                style={{
                  fontWeight: !note.read ? "bold" : "normal", // bold if unread
                }}
              >
                {note.message}
              </p>
              <span className="timestamp">
                {formatTimestamp(note.createdAt)}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
