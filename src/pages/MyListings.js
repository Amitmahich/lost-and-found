// src/pages/MyListings.js
import { collection, getDocs, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { auth, db } from "../firebase/config";
import "../styles/MyListings.css";

export default function MyListings() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const q = query(
          collection(db, "items"),
          where("userId", "==", auth.currentUser?.uid)
        );
        const querySnapshot = await getDocs(q);
        const userItems = [];

        querySnapshot.forEach((doc) => {
          userItems.push({ id: doc.id, ...doc.data() });
        });

        setItems(userItems);
      } catch (error) {
        console.error(error);
        toast.error("Failed to load your listings ❌");
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, []);

  const ImageWithLoader = ({ src, alt }) => {
    const [loaded, setLoaded] = useState(false);
    return (
      <div className="image-wrapper">
        {!loaded && <div className="image-skeleton">Loading...</div>}
        <img
          src={src}
          alt={alt}
          onLoad={() => setLoaded(true)}
          style={{ display: loaded ? "block" : "none" }}
        />
      </div>
    );
  };

  if (loading) return <p className="loader">Loading your listings...</p>;

  return (
    <div className="my-listings-container">
      <h2>🗂️ My Listings</h2>
      {items.length === 0 ? (
        <p>You haven't added any items yet.</p>
      ) : (
        <div className="my-listings-grid">
          {items.map((item) => (
            <div
              className="listing-card glass"
              key={item.id}
              onClick={() => navigate(`/dashboard/item/${item.id}`)}
            >
              <ImageWithLoader src={item.imageUrl} alt={item.itemName} />
              <div className="listing-info">
                <h3>{item.itemName}</h3>
                <p>
                  <strong>Type:</strong> {item.itemType}
                </p>
                <p className="short-desc">
                  {item.description?.slice(0, 60)}...
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
