// src/pages/admin/AdminReports.jsx
import {
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { toast } from "react-toastify"; // ✅ Toast import
import "react-toastify/dist/ReactToastify.css";
import { db } from "../../firebase/config";
import "../../styles/AdminReports.css";

export default function AdminReports() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);

    // Real-time listener
    const q = query(collection(db, "reports"), orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const fetchedReports = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setReports(fetchedReports);
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching reports:", error);
        setLoading(false);
      }
    );

    return () => unsubscribe(); // Cleanup on unmount
  }, []);

  // ✅ Handle mark as handled (with toast instead of alert)
  const handleMarkHandled = async (reportId) => {
    try {
      const reportRef = doc(db, "reports", reportId);
      await updateDoc(reportRef, {
        isHandled: true,
      });

      // ✅ Success toast
      toast.success("Report marked as handled ✅");
    } catch (error) {
      console.error("Error updating report:", error);
      toast.error("Failed to update report ❌");
    }
  };

  return (
    <div className="admin-reports-page">
      <h2>Reports & Notifications</h2>

      {loading ? (
        <p className="loading">Loading reports...</p>
      ) : reports.length === 0 ? (
        <p className="no-reports">No reports found.</p>
      ) : (
        <div className="reports-table-container">
          <table className="admin-reports-table">
            <thead>
              <tr>
                <th>Item ID</th>
                <th>Reason</th>
                <th>Reported By</th>
                <th>Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {reports.map((r) => (
                <tr key={r.id}>
                  <td>{r.itemId}</td>
                  <td>{r.reason || "N/A"}</td>
                  <td>{r.userEmail || "unknown"}</td>
                  <td>
                    {r.createdAt
                      ? r.createdAt.toDate().toLocaleString()
                      : "N/A"}
                  </td>
                  <td>
                    {r.isHandled ? (
                      <span className="handled-label">✅ Handled</span>
                    ) : (
                      <button
                        className="mark-handled-btn"
                        onClick={() => handleMarkHandled(r.id)}
                      >
                        Mark Handled
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
