import {
  collection,
  doc,
  onSnapshot,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { db } from "../../firebase/config";
import "../../styles/AllUsers.css";
import "../../styles/responsive-tables.css";

export default function BlockedUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Real-time listener for blocked users
  useEffect(() => {
    // This query fetches only users with the 'isBlocked: true' field
    const blockedUsersQuery = query(
      collection(db, "users"),
      where("isBlocked", "==", true)
    );

    const unsubscribe = onSnapshot(
      blockedUsersQuery,
      (querySnapshot) => {
        const usersData = querySnapshot.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        }));
        setUsers(usersData);
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching blocked users:", error);
        toast.error("Error fetching blocked users.");
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  // Function to unblock a user
  // This is the same function from AllUsers.js, but here it's only used for unblocking
  const handleUnblock = async (userId) => {
    try {
      await updateDoc(doc(db, "users", userId), { isBlocked: false });
      toast.success("User has been unblocked.");
    } catch (error) {
      console.error("Error unblocking user:", error);
      toast.error("Failed to unblock user.");
    }
  };

  if (loading) {
    return <p>Loading blocked users...</p>;
  }

  return (
    <div className="all-users-page">
      <h2>🚫 Blocked Users</h2>

      {/* Desktop View (Table) */}
      <table className="users-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.length > 0 ? (
            users.map((user) => (
              <tr key={user.id}>
                <td>
                  {user.firstName} {user.lastName}
                </td>
                <td>{user.email}</td>
                <td className="blocked-status">Blocked</td>
                <td>
                  <button
                    onClick={() => handleUnblock(user.id)}
                    className="unblock-btn"
                  >
                    Unblock
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4">No blocked users found</td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Mobile View (Cards) */}
      <div className="mobile-user-list">
        {users.length > 0 ? (
          users.map((user) => (
            <div key={user.id} className="user-card">
              <div>
                <span className="label">Name</span>
                <span className="value">
                  {user.firstName} {user.lastName}
                </span>
              </div>
              <div>
                <span className="label">Email</span>
                <span className="value">{user.email}</span>
              </div>
              <div>
                <span className="label">Status</span>
                <span className="value blocked-status">Blocked</span>
              </div>
              <div className="actions">
                <button
                  onClick={() => handleUnblock(user.id)}
                  className="unblock-btn"
                >
                  Unblock
                </button>
              </div>
            </div>
          ))
        ) : (
          <p>No blocked users found</p>
        )}
      </div>
    </div>
  );
}
