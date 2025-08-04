import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./SingleCase.css";
import BASE_URL from "../../../Config/Api";
import handleError from "../../../Utils/errorHandler";

export default function SingleCase() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [caseData, setCaseData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCase();
  }, []);

  const fetchCase = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/case/${id}`, { withCredentials: true });
      setCaseData(res.data?.data || null);
    } catch (err) {
      handleError(err, "Failed to fetch case");
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async () => {
    try {
      await axios.patch(`${BASE_URL}/case/accept/${id}`, {}, { withCredentials: true });
      toast.success("Case accepted");
      fetchCase();
    } catch (err) {
      handleError(err, "Accept failed");
    }
  };

  const handleReject = async () => {
    try {
      await axios.patch(`${BASE_URL}/case/reject/${id}`, {}, { withCredentials: true });
      toast.success("Case rejected");
      fetchCase();
    } catch (err) {
      handleError(err, "Reject failed");
    }
  };

  const handleStatusUpdate = async (newStatus) => {
    try {
      await axios.patch(`${BASE_URL}/case/update-status/${id}`, { status: newStatus }, { withCredentials: true });
      toast.success(`Status updated to ${newStatus}`);
      fetchCase();
    } catch (err) {
      handleError(err, "Status update failed");
    }
  };

  return (
    <div className="case-detail-container">
      <ToastContainer />
      {loading ? (
        <p>Loading case details...</p>
      ) : !caseData ? (
        <p>No case found</p>
      ) : (
        <div className="case-detail-card">
          <h2><strong>Case Title:</strong> {caseData.title}</h2>
          <p><strong>Description:</strong> {caseData.description}</p>
          <p><strong>Client:</strong> {caseData.client?.username || "N/A"}</p>
          <p><strong>Status:</strong> {caseData.status}</p>
          <p>
            <strong>File:</strong>{" "}
            {caseData.file ? (
              <a href={`http://localhost:3000${caseData.file}`} target="_blank" rel="noopener noreferrer">
                View File
              </a>
            ) : (
              "No file uploaded"
            )}
          </p>

          <div className="case-actions">
            {caseData.status === "pending" && (
              <>
                <button onClick={handleAccept}>✅ Accept</button>
                <button onClick={handleReject}>❌ Reject</button>
              </>
            )}

            {caseData.status === "accepted" && (
              <>
                <button onClick={() => handleStatusUpdate("closed")}>Mark as Closed</button>
                <button onClick={() => handleStatusUpdate("dismissed")}>Mark as Dismissed</button>
              </>
            )}

            <button onClick={() => navigate(-1)}>⬅ Back</button>
          </div>
        </div>
      )}
    </div>
  );
}
