// src/pages/Responses.js
import { onAuthStateChanged } from "firebase/auth";
import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { auth, db } from "../firebase/config";
import "../styles/Responses.css";

export default function Responses() {
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [showPhoneMap, setShowPhoneMap] = useState({}); // { responseId: phoneNumber }

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (authUser) => {
      if (!authUser) {
        toast.error("User not authenticated");
        setLoading(false);
        return;
      }

      setUser(authUser);

      try {
        const q = query(
          collection(db, "responses"),
          where("responderId", "==", authUser.uid)
        );
        const q2 = query(
          collection(db, "responses"),
          where("ownerId", "==", authUser.uid)
        );

        // ✅ Real-time listeners
        const unsub1 = onSnapshot(q, (resSnap) => {
          setResponses((prev) => {
            const received = prev.filter((r) => r.type === "received");
            const sent = resSnap.docs.map((doc) => ({
              id: doc.id,
              type: "sent",
              ...doc.data(),
            }));
            return [...received, ...sent];
          });
        });

        const unsub2 = onSnapshot(q2, (ownSnap) => {
          setResponses((prev) => {
            const sent = prev.filter((r) => r.type === "sent");
            const received = ownSnap.docs.map((doc) => ({
              id: doc.id,
              type: "received",
              ...doc.data(),
            }));
            return [...sent, ...received];
          });
        });

        setLoading(false);

        // cleanup
        return () => {
          unsub1();
          unsub2();
        };
      } catch (err) {
        console.error(err);
        toast.error("Failed to fetch responses ❌");
        setLoading(false);
      }
    });

    return () => unsubscribeAuth();
  }, []);

  const handleApprove = async (id) => {
    try {
      await updateDoc(doc(db, "responses", id), {
        status: "Approved",
      });
      // No manual setResponses needed since realtime listener will auto update
      toast.success("Response approved ✅");
    } catch (err) {
      toast.error("Failed to approve ❌");
    }
  };

  const handleShowPhone = async (res) => {
    if (showPhoneMap[res.id]) {
      setShowPhoneMap((prev) => ({
        ...prev,
        [res.id]: null,
      }));
      return;
    }

    try {
      const userDoc = await getDoc(doc(db, "users", res.ownerId));
      const phone = userDoc.exists()
        ? userDoc.data().mobile || "Not Provided"
        : "Not Found";

      setShowPhoneMap((prev) => ({
        ...prev,
        [res.id]: phone,
      }));
    } catch (err) {
      console.error("Failed to fetch phone number:", err);
      toast.error("Error getting phone number ❌");
    }
  };

  if (loading) return <p className="loader">Loading responses...</p>;

  if (!user)
    return <p className="loader">Please login to view your responses.</p>;

  return (
    <div className="responses-container">
      <h2>Responses to Your Items 📬</h2>
      <div className="response-grid">
        {responses.filter((r) => r.type === "received").length === 0 ? (
          <p className="no-data">No responses received yet.</p>
        ) : (
          responses
            .filter((r) => r.type === "received")
            .map((res) => (
              <div className="response-card glass" key={res.id}>
                <h3>Item: {res.itemName}</h3>
                <p>
                  <strong>Answer:</strong> {res.answer}
                </p>
                <p>
                  <strong>From:</strong> {res.responderEmail}
                </p>
                <p>
                  <strong>Date:</strong> {res.responseDate}
                </p>
                <p>
                  <strong>Status:</strong>{" "}
                  <span
                    className={`badge badge-${
                      res.status?.toLowerCase?.() || "pending"
                    }`}
                  >
                    {res.status}
                  </span>
                </p>
                {res.status === "Pending" && (
                  <button
                    className="gradient-green"
                    onClick={() => handleApprove(res.id)}
                  >
                    ✅ Approve
                  </button>
                )}
              </div>
            ))
        )}
      </div>

      <h2>Responses You've Sent 💌</h2>
      <div className="response-grid">
        {responses.filter((r) => r.type === "sent").length === 0 ? (
          <p className="no-data">You haven’t sent any responses yet.</p>
        ) : (
          responses
            .filter((r) => r.type === "sent")
            .map((res) => (
              <div className="response-card glass" key={res.id}>
                <h3>Item: {res.itemName}</h3>
                <p>
                  <strong>Your Answer:</strong> {res.answer}
                </p>
                <p>
                  <strong>To Owner:</strong> {res.ownerId}
                </p>
                <p>
                  <strong>Date:</strong> {res.responseDate}
                </p>
                <p>
                  <strong>Status:</strong>{" "}
                  <span
                    className={`badge badge-${
                      res.status?.toLowerCase?.() || "pending"
                    }`}
                  >
                    {res.status}
                  </span>
                </p>

                {res.status === "Approved" && (
                  <>
                    <button
                      className="gradient-blue"
                      onClick={() => handleShowPhone(res)}
                    >
                      📞 Show Owner Number
                    </button>
                    {showPhoneMap[res.id] && (
                      <div className="show-number-section">
                        <strong>Phone:</strong> {showPhoneMap[res.id]}
                      </div>
                    )}
                  </>
                )}
              </div>
            ))
        )}
      </div>
    </div>
  );
}
