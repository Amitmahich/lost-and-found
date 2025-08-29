// import {
//   collection,
//   doc,
//   increment,
//   onSnapshot,
//   query,
//   updateDoc,
//   where,
// } from "firebase/firestore";
// import { useEffect, useState } from "react";
// import { Link } from "react-router-dom";
// import { toast } from "react-toastify";
// import { db } from "../firebase/config";
// import "../styles/Dashboard.css";

// export default function Dashboard() {
//   const [lostItems, setLostItems] = useState([]);
//   const [foundItems, setFoundItems] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [search, setSearch] = useState("");
//   const [filter, setFilter] = useState("all");
//   const [reportItemId, setReportItemId] = useState(null);
//   const [reportText, setReportText] = useState("");
//   const [submitting, setSubmitting] = useState(false);

//   // 🔹 Firestore listener
//   useEffect(() => {
//     const itemsQuery = query(
//       collection(db, "items"),
//       where("isBlocked", "==", false)
//     );

//     const unsubscribe = onSnapshot(
//       itemsQuery,
//       (querySnapshot) => {
//         const lost = [];
//         const found = [];
//         querySnapshot.forEach((d) => {
//           const data = d.data();
//           const itemData = { id: d.id, ...data };
//           if (data.itemType?.toLowerCase() === "lost it") {
//             lost.push(itemData);
//           } else if (data.itemType?.toLowerCase() === "found it") {
//             found.push(itemData);
//           }
//         });

//         setLostItems(lost);
//         setFoundItems(found);
//         setLoading(false);
//       },
//       (error) => {
//         console.error("Error fetching items:", error);
//         toast.error("❌ Failed to load items");
//         setLoading(false);
//       }
//     );
//     return () => unsubscribe();
//   }, []);

//   // 🔹 Search Filter
//   const matchesSearch = (item) =>
//     item.itemName.toLowerCase().includes(search.toLowerCase()) ||
//     item.description.toLowerCase().includes(search.toLowerCase());

//   const filteredLost = lostItems.filter(matchesSearch);
//   const filteredFound = foundItems.filter(matchesSearch);

//   // 🔹 Image Loader
//   const ImageWithLoader = ({ src, alt }) => {
//     const [loaded, setLoaded] = useState(false);
//     return (
//       <div className="image-wrapper">
//         {!loaded && <div className="spinner"></div>}
//         <img
//           src={src}
//           alt={alt}
//           onLoad={() => setLoaded(true)}
//           style={{ display: loaded ? "block" : "none" }}
//         />
//       </div>
//     );
//   };

//   // 🔹 Report Submit
//   const handleReportSubmit = async () => {
//     if (!reportText.trim()) {
//       toast.error("⚠️ Report reason cannot be empty.");
//       return;
//     }
//     setSubmitting(true);
//     try {
//       await updateDoc(doc(db, "items", reportItemId), {
//         reports: increment(1),
//         lastReportReason: reportText,
//       });
//       toast.success("✅ Report submitted successfully!");
//       setReportText("");
//       setReportItemId(null);
//     } catch (error) {
//       console.error("Error submitting report:", error);
//       toast.error("❌ Failed to submit report.");
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   // 🔹 Render Items
//   const renderItems = (items) => {
//     if (!items.length) {
//       return <p className="empty-text">No items found.</p>;
//     }
//     return (
//       <div className="items-grid">
//         {items.map((item) => (
//           <div key={item.id} className="item-card-container">
//             <Link to={`/dashboard/item/${item.id}`} className="item-card">
//               <div className="image-wrapper">
//                 <ImageWithLoader src={item.imageUrl} alt={item.itemName} />

//                 {/* ❗ Report Icon */}
//                 <button
//                   onClick={(e) => {
//                     e.preventDefault();
//                     setReportItemId(item.id);
//                   }}
//                   className="alert-icon"
//                   title="Report this item"
//                 >
//                   ❗
//                 </button>
//               </div>

//               <div className="item-details">
//                 <h3>{item.itemName}</h3>
//                 <p>{item.description}</p>
//                 {item.question && (
//                   <p className="question">Question: {item.question}</p>
//                 )}
//               </div>
//             </Link>
//           </div>
//         ))}
//       </div>
//     );
//   };

//   return (
//     <div className="dashboard-content">
//       {loading ? (
//         <p className="loading-text">⏳ Loading items...</p>
//       ) : (
//         <>
//           {/* 🔹 Filters */}
//           <div className="filter-controls">
//             <input
//               type="text"
//               placeholder="Search by item name or description..."
//               value={search}
//               onChange={(e) => setSearch(e.target.value)}
//               className="search-input"
//             />
//             <select
//               value={filter}
//               onChange={(e) => setFilter(e.target.value)}
//               className="filter-select"
//             >
//               <option value="all">All</option>
//               <option value="lost">Lost Only</option>
//               <option value="found">Found Only</option>
//             </select>
//           </div>

//           {/* 🔹 Sections */}
//           {(filter === "all" || filter === "lost") && (
//             <section>
//               <h2>Lost Items </h2>
//               {renderItems(filteredLost)}
//             </section>
//           )}

//           {(filter === "all" || filter === "found") && (
//             <section>
//               <h2>Found Items </h2>
//               {renderItems(filteredFound)}
//             </section>
//           )}
//         </>
//       )}

//       {/* 🔹 Report Popup */}
//       {reportItemId && (
//         <div className="report-modal-overlay">
//           <div className="report-modal">
//             <h3>🚨 Report Item</h3>
//             <textarea
//               placeholder="Enter your reason for reporting..."
//               value={reportText}
//               onChange={(e) => setReportText(e.target.value)}
//               disabled={submitting}
//             />
//             <div className="modal-actions">
//               <button
//                 onClick={handleReportSubmit}
//                 disabled={submitting}
//                 className="submit-btn"
//               >
//                 {submitting ? "Submitting..." : "Submit"}
//               </button>
//               <button
//                 onClick={() => {
//                   setReportItemId(null);
//                   setReportText("");
//                 }}
//                 className="cancel-btn"
//               >
//                 Cancel
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

import {
  collection,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import ReportModal from "../components/ReportModal";
import { db, auth } from "../firebase/config";   // ✅ auth import
import { useAuthState } from "react-firebase-hooks/auth";
import "../styles/Dashboard.css";

export default function Dashboard() {
  const [lostItems, setLostItems] = useState([]);
  const [foundItems, setFoundItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [reportItemId, setReportItemId] = useState(null);

  const [currentUser] = useAuthState(auth);   // ✅ currentUser

  // 🔹 Firestore listener
  useEffect(() => {
    const itemsQuery = query(
      collection(db, "items"),
      where("isBlocked", "==", false)
    );

    const unsubscribe = onSnapshot(
      itemsQuery,
      (querySnapshot) => {
        const lost = [];
        const found = [];
        querySnapshot.forEach((d) => {
          const data = d.data();
          const itemData = { id: d.id, ...data };
          if (data.itemType?.toLowerCase() === "lost it") {
            lost.push(itemData);
          } else if (data.itemType?.toLowerCase() === "found it") {
            found.push(itemData);
          }
        });

        setLostItems(lost);
        setFoundItems(found);
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching items:", error);
        toast.error("❌ Failed to load items");
        setLoading(false);
      }
    );
    return () => unsubscribe();
  }, []);

  // 🔹 Search Filter
  const matchesSearch = (item) =>
    item.itemName.toLowerCase().includes(search.toLowerCase()) ||
    item.description.toLowerCase().includes(search.toLowerCase());

  const filteredLost = lostItems.filter(matchesSearch);
  const filteredFound = foundItems.filter(matchesSearch);

  // 🔹 Image Loader
  const ImageWithLoader = ({ src, alt }) => {
    const [loaded, setLoaded] = useState(false);
    return (
      <div className="image-wrapper">
        {!loaded && <div className="spinner"></div>}
        <img
          src={src}
          alt={alt}
          onLoad={() => setLoaded(true)}
          style={{ display: loaded ? "block" : "none" }}
        />
      </div>
    );
  };

  // 🔹 Render Items
  const renderItems = (items) => {
    if (!items.length) {
      return <p className="empty-text">No items found.</p>;
    }
    return (
      <div className="items-grid">
        {items.map((item) => (
          <div key={item.id} className="item-card-container">
            <Link to={`/dashboard/item/${item.id}`} className="item-card">
              <div className="image-wrapper">
                <ImageWithLoader src={item.imageUrl} alt={item.itemName} />

                {/* ❗ Report Icon */}
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    setReportItemId(item.id);
                  }}
                  className="alert-icon"
                  title="Report this item"
                >
                  ❗
                </button>
              </div>

              <div className="item-details">
                <h3>{item.itemName}</h3>
                <p>{item.description}</p>
                {item.question && (
                  <p className="question">Question: {item.question}</p>
                )}
              </div>
            </Link>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="dashboard-content">
      {loading ? (
        <p className="loading-text">⏳ Loading items...</p>
      ) : (
        <>
          {/* 🔹 Filters */}
          <div className="filter-controls">
            <input
              type="text"
              placeholder="Search by item name or description..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="search-input"
            />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="filter-select"
            >
              <option value="all">All</option>
              <option value="lost">Lost Only</option>
              <option value="found">Found Only</option>
            </select>
          </div>

          {/* 🔹 Sections */}
          {(filter === "all" || filter === "lost") && (
            <section>
              <h2>Lost Items </h2>
              {renderItems(filteredLost)}
            </section>
          )}

          {(filter === "all" || filter === "found") && (
            <section>
              <h2>Found Items </h2>
              {renderItems(filteredFound)}
            </section>
          )}
        </>
      )}

      {/* 🔹 Report Modal */}
      {reportItemId && (
        <ReportModal
          itemId={reportItemId}
          onClose={() => setReportItemId(null)}
          currentUser={currentUser}   // ✅ ab pass kar rahe hai
        />
      )}
    </div>
  );
}
