import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { useState } from "react";
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
  const navigate = useNavigate();

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

      await addDoc(collection(db, "items"), {
        itemName: name,
        description,
        question,
        itemType: type,
        imageUrl,
        createdAt: serverTimestamp(),
        userId: auth.currentUser.uid,
        userEmail: auth.currentUser.email,
      });

      toast.success("Item posted successfully 🎉");
      navigate("/dashboard");
    } catch (error) {
      console.error(error);
      toast.error("Error posting item 😢");
    } finally {
      setLoading(false);
    }
  };

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

        <textarea
          name="description"
          placeholder="Item Description"
          value={form.description}
          onChange={handleChange}
          rows="3"
          required
        />

        <input
          type="text"
          name="question"
          placeholder="Enter a question based on the item"
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
