import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { db } from "../../firebase/config";
import "../../styles/AllItems.css"; // ✅ (alag css for items list)
import ReportsViewer from "../../components/ReportsViewer"; // ✅ import new modal component

export default function AllItems() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedReports, setSelectedReports] = useState([]);
  const [showReports, setShowReports] = useState(false);

  // Fetch all items
  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "items"),
      (querySnapshot) => {
        const itemsData = querySnapshot.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        }));
        setItems(itemsData);
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching real-time items:", error);
        toast.error("Error fetching items.");
        setLoading(false);
      }
    );
    return () => unsubscribe();
  }, []);

  // Fetch reports of a specific item
  const handleViewReports = async (itemId) => {
    try {
      const q = query(collection(db, "reports"), where("itemId", "==", itemId));
      const querySnapshot = await getDocs(q);
      const reportsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setSelectedReports(reportsData);
      setShowReports(true);
    } catch (error) {
      console.error("Error fetching reports:", error);
      toast.error("Failed to fetch reports.");
    }
  };

  // Delete item
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      try {
        await deleteDoc(doc(db, "items", id));
        toast.success("Item deleted successfully!");
      } catch (error) {
        console.error("Error deleting item:", error);
        toast.error("Failed to delete item.");
      }
    }
  };

  if (loading) return <p>Loading items...</p>;

  return (
    <div className="all-items-page">
      <h2>📦 All Posted Items</h2>

      {/* ----------------- Desktop View (Table) ----------------- */}
      <table className="items-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Description</th>
            <th>Type</th>
            <th>Posted By</th>
            <th>Image</th>
            <th>Reports</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.length > 0 ? (
            items.map((item) => (
              <tr key={item.id}>
                <td>{item.itemName}</td>
                <td>{item.description}</td>
                <td>{item.itemType}</td>
                <td>{item.userEmail}</td>
                <td>
                  {item.imageUrl && (
                    <img src={item.imageUrl} alt="item" width="60" />
                  )}
                </td>
                <td>
                  <button
                    onClick={() => handleViewReports(item.id)}
                    className="view-btn"
                  >
                    View Reports
                  </button>
                </td>
                <td>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="delete-btn"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7">No items found</td>
            </tr>
          )}
        </tbody>
      </table>

      {/* ----------------- Mobile View (Cards) ----------------- */}
      <div className="mobile-item-list">
        {items.length > 0 ? (
          items.map((item) => (
            <div key={item.id} className="item-card">
              <div>
                <span className="label">Name</span>
                <span className="value">{item.itemName}</span>
              </div>
              <div>
                <span className="label">Description</span>
                <span className="value">{item.description}</span>
              </div>
              <div>
                <span className="label">Type</span>
                <span className="value">{item.itemType}</span>
              </div>
              <div>
                <span className="label">Posted By</span>
                <span className="value">{item.userEmail}</span>
              </div>
              <div>
                <span className="label">Image</span>
                <span className="value">
                  {item.imageUrl && <img src={item.imageUrl} alt="item" />}
                </span>
              </div>
              <div className="actions">
                <button
                  onClick={() => handleViewReports(item.id)}
                  className="view-btn"
                >
                  View Reports
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="delete-btn"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <p>No items found</p>
        )}
      </div>

      {/* ----------------- Reports Modal (Reusable Component) ----------------- */}
      {showReports && (
        <ReportsViewer
          reports={selectedReports}
          onClose={() => setShowReports(false)}
        />
      )}
    </div>
  );
}
