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

export default function AllUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Real-time data listener for users collection
  useEffect(() => {
    // ✅ Updated query to filter out blocked users
    const usersQuery = query(
      collection(db, "users"),
      where("isAdmin", "==", false),
      where("isBlocked", "==", false)
    );

    const unsubscribe = onSnapshot(
      usersQuery,
      (querySnapshot) => {
        const usersData = querySnapshot.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        }));
        setUsers(usersData);
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching real-time users:", error);
        toast.error("Error fetching users.");
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  // Function to block or unblock a user
  const handleBlockUnblock = async (userId, isBlocked) => {
    try {
      await updateDoc(doc(db, "users", userId), { isBlocked: !isBlocked });
      toast.success(`User has been ${isBlocked ? "unblocked" : "blocked"}.`);
    } catch (error) {
      console.error("Error updating user status:", error);
      toast.error("Failed to update user status.");
    }
  };

  if (loading) {
    return <p>Loading users...</p>;
  }

  return (
    <div className="all-users-page">
      <h2>👥 All Registered Users</h2>

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
                <td>{user.isBlocked ? "Blocked" : "Active"}</td>
                <td>
                  <button
                    onClick={() => handleBlockUnblock(user.id, user.isBlocked)}
                    className={user.isBlocked ? "unblock-btn" : "block-btn"}
                  >
                    {user.isBlocked ? "Unblock" : "Block"}
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4">No users found</td>
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
                <span className="value">
                  {user.isBlocked ? "Blocked" : "Active"}
                </span>
              </div>
              <div className="actions">
                <button
                  onClick={() => handleBlockUnblock(user.id, user.isBlocked)}
                  className={user.isBlocked ? "unblock-btn" : "block-btn"}
                >
                  {user.isBlocked ? "Unblock" : "Block"}
                </button>
              </div>
            </div>
          ))
        ) : (
          <p>No users found</p>
        )}
      </div>
    </div>
  );
}
