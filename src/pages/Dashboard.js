import { collection, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { db } from "../firebase/config";
import "../styles/Dashboard.css";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const [lostItems, setLostItems] = useState([]);
  const [foundItems, setFoundItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all"); // all | lost | found

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "items"));
        const lost = [];
        const found = [];

        querySnapshot.forEach((doc) => {
          const data = doc.data();
          const itemData = { id: doc.id, ...data };

          if (data.itemType?.toLowerCase() === "lost it") {
            lost.push(itemData);
          } else if (data.itemType?.toLowerCase() === "found it") {
            found.push(itemData);
          }
        });

        setLostItems(lost);
        setFoundItems(found);
      } catch (error) {
        console.error("Error fetching items:", error);
        toast.error("❌ Failed to load items");
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, []);

  const matchesSearch = (item) =>
    item.itemName.toLowerCase().includes(search.toLowerCase()) ||
    item.description.toLowerCase().includes(search.toLowerCase());

  const filteredLost = lostItems.filter(matchesSearch);
  const filteredFound = foundItems.filter(matchesSearch);

  return (
    <div className="dashboard-content">
      {loading ? (
        <p className="loading-text">⏳ Loading items...</p>
      ) : (
        <>
          {/* Search and Filter Controls */}
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

          {/* Lost Items Section */}
          {(filter === "all" || filter === "lost") && (
            <section>
              <h2>Lost Items 💔</h2>
              <div className="items-grid">
                {filteredLost.length ? (
                  filteredLost.map((item) => (
                    <Link
                      to={`/dashboard/item/${item.id}`}
                      className="item-card"
                      key={item.id}
                    >
                      <img src={item.imageUrl} alt={item.itemName} />
                      <div className="item-details">
                        <h3>{item.itemName}</h3>
                        <p>{item.description}</p>
                        <p className="question">Question: {item.question}</p>
                      </div>
                    </Link>
                  ))
                ) : (
                  <p className="empty-text">No lost items found.</p>
                )}
              </div>
            </section>
          )}

          {/* Found Items Section */}
          {(filter === "all" || filter === "found") && (
            <section>
              <h2>Found Items 🎉</h2>
              <div className="items-grid">
                {filteredFound.length ? (
                  filteredFound.map((item) => (
                    <Link
                      to={`/dashboard/item/${item.id}`}
                      className="item-card"
                      key={item.id}
                    >
                      <img src={item.imageUrl} alt={item.itemName} />
                      <div className="item-details">
                        <h3>{item.itemName}</h3>
                        <p>{item.description}</p>
                        <p className="question">Question: {item.question}</p>
                      </div>
                    </Link>
                  ))
                ) : (
                  <p className="empty-text">No found items found.</p>
                )}
              </div>
            </section>
          )}
        </>
      )}
    </div>
  );
}
