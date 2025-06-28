// src/pages/ItemDetail.js
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { auth, db } from "../firebase/config";
import "../styles/ItemDetail.css";

export default function ItemDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showAnswerModal, setShowAnswerModal] = useState(false);
  const [answer, setAnswer] = useState("");
  const [showPhoneModal, setShowPhoneModal] = useState(false);
  const [responseDocId, setResponseDocId] = useState(null);
  const [responseStatus, setResponseStatus] = useState(null);
  const [hasResponded, setHasResponded] = useState(false);

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const docRef = doc(db, "items", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setItem({ id: docSnap.id, ...docSnap.data() });
        } else {
          toast.error("Item not found ❌");
          navigate("/dashboard");
        }

        await checkIfUserResponded();
      } catch (error) {
        console.error(error);
        toast.error("Error loading item 😢");
      } finally {
        setLoading(false);
      }
    };

    const checkIfUserResponded = async () => {
      const responseRef = collection(db, "responses");
      const snapshot = await getDocs(responseRef);
      const userResponse = snapshot.docs.find(
        (doc) =>
          doc.data().itemId === id &&
          doc.data().responderId === auth.currentUser?.uid
      );

      if (userResponse) {
        setHasResponded(true);
        setResponseDocId(userResponse.id);
        setResponseStatus(userResponse.data().status);
      }
    };

    fetchItem();
  }, [id, navigate]);

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      try {
        await deleteDoc(doc(db, "items", id));
        toast.success("Item deleted ✅");
        navigate("/dashboard");
      } catch (error) {
        toast.error("Error deleting item ❌");
      }
    }
  };

  const handleFoundClick = () => {
    setShowConfirmModal(true);
  };

  const handleConfirmYes = () => {
    setShowConfirmModal(false);
    setShowAnswerModal(true);
  };

  const handleSubmitAnswer = async () => {
    if (!answer.trim()) {
      toast.error("Answer cannot be empty ❌");
      return;
    }

    try {
      const docRef = await addDoc(collection(db, "responses"), {
        itemId: item.id,
        itemName: item.itemName,
        ownerId: item.userId,
        responderId: auth.currentUser?.uid,
        responderEmail: auth.currentUser?.email,
        responseDate: new Date().toLocaleString(),
        answer,
        status: "Pending",
        phone: auth.currentUser?.phoneNumber || "Not Provided",
      });

      setResponseDocId(docRef.id);
      setResponseStatus("Pending");
      setHasResponded(true);

      toast.success("Answer submitted successfully ✅");
      setShowAnswerModal(false);
      setAnswer("");
    } catch (error) {
      console.error("Error submitting response:", error);
      toast.error("Failed to submit response ❌");
    }
  };

  const handleApprove = async () => {
    try {
      await updateDoc(doc(db, "responses", responseDocId), {
        status: "Approved",
      });
      setResponseStatus("Approved");
      toast.success("Response approved ✅");
    } catch (error) {
      toast.error("Failed to approve ❌");
    }
  };

  if (loading) return <div className="loader">Loading item...</div>;
  if (!item) return null;

  const isOwner = auth.currentUser?.uid === item.userId;
  const createdAt = item.createdAt?.toDate?.().toLocaleString() || "N/A";
  const buttonText =
    item.itemType === "Found it"
      ? "✅ I Lost This Item"
      : "✅ I Found This Item";
  const modalQuestion =
    item.itemType === "Found it"
      ? "Are you sure you lost this item?"
      : "Are you sure you found this item?";

  return (
    <div className="item-detail-container">
      <button className="back-button" onClick={() => navigate(-1)}>
        ← Back
      </button>

      <div className="item-detail-content animate-fade-in">
        <div className="image-section glass">
          <img src={item.imageUrl} alt={item.itemName} />
        </div>

        <div className="info-section">
          <div className="info-box">
            <h2>Item Name: {item.itemName}</h2>
            <p>
              <strong>Description:</strong> {item.description}
            </p>
            <p>
              <strong>Type:</strong> {item.itemType}
            </p>
            <p>
              <strong>Created At:</strong> {createdAt}
            </p>
          </div>

          <div className="button-row">
            {isOwner ? (
              <>
                <button
                  className="delete-btn gradient-red"
                  onClick={handleDelete}
                >
                  🗑️ Delete Item
                </button>
                {responseDocId && responseStatus === "Pending" && (
                  <button
                    className="approve-btn gradient-green"
                    onClick={handleApprove}
                  >
                    ✅ Approve Response
                  </button>
                )}
                {responseStatus === "Approved" && (
                  <button
                    className="show-number-btn gradient-blue"
                    onClick={() => setShowPhoneModal(true)}
                  >
                    📞 Show Number
                  </button>
                )}
              </>
            ) : hasResponded ? (
              <p className="response-info">
                Sorry, you have already submitted your response.
              </p>
            ) : (
              <button
                className="found-btn gradient-green"
                onClick={handleFoundClick}
              >
                {buttonText}
              </button>
            )}
          </div>
        </div>
      </div>

      {showConfirmModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>{modalQuestion}</h3>
            <div className="modal-actions">
              <button onClick={() => setShowConfirmModal(false)}>No</button>
              <button className="gradient-green" onClick={handleConfirmYes}>
                Yes
              </button>
            </div>
          </div>
        </div>
      )}

      {showAnswerModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Your Question:</h3>
            <p>{item.question} ?</p>
            <input
              type="text"
              placeholder="Enter your answer here"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
            />
            <div className="modal-actions">
              <button onClick={() => setShowAnswerModal(false)}>Close</button>
              <button className="gradient-blue" onClick={handleSubmitAnswer}>
                Submit
              </button>
            </div>
          </div>
        </div>
      )}

      {showPhoneModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Responder's Phone Number</h3>
            <p>{auth.currentUser?.phoneNumber || "Phone not provided"}</p>
            <div className="modal-actions">
              <button onClick={() => setShowPhoneModal(false)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
