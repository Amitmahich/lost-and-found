import {
  addDoc,
  collection,
  doc,
  increment,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { useState } from "react";
import { toast } from "react-toastify";
import { db } from "../firebase/config";

export default function ReportModal({ itemId, onClose, currentUser }) {
  const [reportText, setReportText] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!reportText.trim()) {
      toast.error("⚠️ Report reason cannot be empty.");
      return;
    }
    setSubmitting(true);

    try {
      console.log("📌 Adding report to 'reports' collection...");

      // ✅ Step 1: Save in "reports" collection
      const reportDoc = await addDoc(collection(db, "reports"), {
        itemId,
        reason: reportText,
        userId: currentUser?.uid || "anonymous",
        userEmail: currentUser?.email || "unknown",
        createdAt: serverTimestamp(),
        isHandled: false,
      });

      console.log("✅ Report added with ID:", reportDoc.id);

      // ✅ Step 2: Update item
      const itemRef = doc(db, "items", itemId);
      await updateDoc(itemRef, {
        reports: increment(1),
        lastReportReason: reportText,
        lastReportedAt: serverTimestamp(),
      });
 
      toast.success("✅ Report submitted successfully!");
      setReportText("");
      onClose();
    } catch (error) { 
      toast.error("❌ Failed to submit report.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="report-modal-overlay">
      <div className="report-modal">
        <h3>🚨 Report Item</h3>
        <textarea
          placeholder="Enter your reason for reporting..."
          value={reportText}
          onChange={(e) => setReportText(e.target.value)}
          disabled={submitting}
        />
        <div className="modal-actions">
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="submit-btn"
          >
            {submitting ? "Submitting..." : "Submit"}
          </button>
          <button onClick={onClose} className="cancel-btn">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
