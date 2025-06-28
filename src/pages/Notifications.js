// src/pages/Notifications.js
import {
  collection,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { auth, db } from "../firebase/config";
import "../styles/Notifications.css";

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

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

        setNotifications(
          result.sort((a, b) => b.timestamp?.seconds - a.timestamp?.seconds)
        );

        for (const note of result) {
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
              }`}
            >
              <p>{note.message}</p>
              <span className="timestamp">
                {note.timestamp?.seconds
                  ? new Date(note.timestamp.seconds * 1000).toLocaleString()
                  : "Just now"}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
