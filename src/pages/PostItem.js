import {
  addDoc,
  collection,
  doc,
  getDocs,
  onSnapshot,
  serverTimestamp,
  increment,
  updateDoc,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { auth, db } from "../firebase/config";
import "../styles/PostItem.css";
import { uploadImageToCloudinary } from "../utils/uploadToCloudinary";

export default function PostItem() {
  const [form, setForm] = useState({
    name: "",
    description: "",
    question: "",
    type: "Lost it",
    image: null,
  });

  const [loading, setLoading] = useState(false);
  const [isUserBlocked, setIsUserBlocked] = useState(false);
  const [userStatusLoading, setUserStatusLoading] = useState(true);
  const navigate = useNavigate();

  // Check user's blocked status in real-time
  useEffect(() => {
    if (auth.currentUser) {
      const userRef = doc(db, "users", auth.currentUser.uid);
      const unsubscribe = onSnapshot(
        userRef,
        (docSnap) => {
          if (docSnap.exists()) {
            const userData = docSnap.data();
            setIsUserBlocked(userData.isBlocked);
          }
          setUserStatusLoading(false);
        },
        (error) => {
          console.error("Error fetching user status:", error);
          setUserStatusLoading(false);
        }
      );
      return () => unsubscribe();
    } else {
      setUserStatusLoading(false);
    }
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, description, question, type, image } = form;

    if (!name || !description || !question || !type || !image) {
      toast.error("Please fill all fields");
      return;
    }

    try {
      setLoading(true);

      const imageUrl = await uploadImageToCloudinary(image);

      const itemRef = await addDoc(collection(db, "items"), {
        itemName: name,
        description,
        question,
        itemType: type,
        imageUrl,
        createdAt: serverTimestamp(),
        userId: auth.currentUser.uid,
        userEmail: auth.currentUser.email,
        isBlocked: false,
        reports: 0,
      });

      const userRef = doc(db, "users", auth.currentUser.uid);
      await updateDoc(userRef, {
        postCount: increment(1),
      });

      const usersSnapshot = await getDocs(collection(db, "users"));
      const notificationPromises = [];

      usersSnapshot.forEach((docSnap) => {
        const user = docSnap.data();
        if (user.uid !== auth.currentUser.uid) {
          notificationPromises.push(
            addDoc(collection(db, "notifications"), {
              userId: user.uid,
              message: `${auth.currentUser.email} posted a new item: ${name}`,
              itemId: itemRef.id,
              itemType: type,
              read: false,
              createdAt: serverTimestamp(),
            })
          );
        }
      });

      await Promise.all(notificationPromises);

      toast.success("Item posted successfully 🎉");
      navigate("/dashboard");
    } catch (error) {
      console.error("Error posting item:", error);
      toast.error("Error posting item 😢");
    } finally {
      setLoading(false);
    }
  };

  if (userStatusLoading) {
    return <p>Checking user status...</p>;
  }

  // ✅ Agar user blocked hai toh sirf blocked message dikhega
  if (isUserBlocked) {
    return (
      <div className="post-item-container">
        <div className="blocked-message">
          🚫 You have been blocked by the admin and cannot post new items.
        </div>
      </div>
    );
  }

  // ✅ Agar user blocked nahi hai, toh form dikhega
  return (
    <div className="post-item-container">
      <form className="post-item-form" onSubmit={handleSubmit}>
        <h2>Add New Item 📝</h2>

        <input
          type="text"
          name="name"
          placeholder="Item Name"
          value={form.name}
          onChange={handleChange}
          required
        />

        <label>
          Item Description:
          <small className="field-hint">
            Describe where/how you lost/found the item, color, brand, etc.
          </small>
        </label>
        <textarea
          name="description"
          placeholder="E.g., Black wallet lost near library with ID and cards"
          value={form.description}
          onChange={handleChange}
          rows="3"
          required
        />

        <label>
          Security Question:
          <small className="field-hint">
            Ask a question only the real owner can answer. E.g., "What name was
            on the ID?"
          </small>
        </label>
        <input
          type="text"
          name="question"
          placeholder="E.g., What brand is the watch?"
          value={form.question}
          onChange={handleChange}
          required
        />

        <select name="type" value={form.type} onChange={handleChange}>
          <option value="Lost it">Lost it</option>
          <option value="Found it">Found it</option>
        </select>

        <input
          type="file"
          name="image"
          accept="image/*"
          onChange={handleChange}
          required
        />

        <div className="form-buttons">
          <button
            type="button"
            className="close-btn"
            onClick={() => navigate("/dashboard")}
          >
            Close
          </button>
          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? "Uploading..." : "Submit"}
          </button>
        </div>
      </form>
    </div>
  );
}
