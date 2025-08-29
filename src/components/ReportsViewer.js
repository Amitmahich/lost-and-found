// src/components/ReportsViewer.jsx
import "../styles/ReportsViewer.css";

export default function ReportsViewer({ reports, onClose }) {
  // ✅ Sort reports by createdAt (latest first)
  const sortedReports = (reports || []).slice().sort((a, b) => {
    const dateA = a.createdAt ? a.createdAt.toDate() : new Date(0);
    const dateB = b.createdAt ? b.createdAt.toDate() : new Date(0);
    return dateB - dateA; // latest first
  });

  return (
    <div className="reports-modal">
      <div className="modal-content">
        {/* Header */}
        <div className="modal-header">
          <h3>
            📑 Reports{" "}
            {sortedReports.length > 0 && (
              <span className="report-count">
                ({sortedReports.length})
              </span>
            )}
          </h3>
        </div>

        {/* Body */}
        <div className="modal-body">
          {sortedReports.length > 0 ? (
            <div className="table-responsive">
              <table className="reports-table">
                <thead>
                  <tr>
                    <th>Reason</th>
                    <th>Reported By</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedReports.map((r, i) => (
                    <tr key={i}>
                      <td data-label="Reason">{r.reason}</td>
                      <td data-label="Reported By">
                        {r.userEmail || "unknown"}
                      </td>
                      <td data-label="Date">
                        {r.createdAt
                          ? r.createdAt.toDate().toLocaleString()
                          : "N/A"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="no-reports">No reports found for this item.</p>
          )}
        </div>

        {/* Footer Close Button */}
        <div className="modal-footer">
          <button className="close-btn" onClick={onClose}>
            ✖ Close
          </button>
        </div>
      </div>
    </div>
  );
}
