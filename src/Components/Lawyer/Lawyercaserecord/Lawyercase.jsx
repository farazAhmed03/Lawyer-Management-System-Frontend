import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Lawyercase.css";
import { useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import BASE_URL from "../../../Config/Api";
import handleError from "../../../Utils/errorHandler";

export default function Lawyercase() {
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCases();
  }, []);

  const fetchCases = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/case/`, { withCredentials: true });
      setCases(res.data.data || []);
    } catch (err) {
      handleError(err, "Failed to fetch cases");
      setCases([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="all-cases-container">
      <ToastContainer />
      <h2 className="cases-heading">📁 Your Cases</h2>
      {loading ? (
        <p>Loading cases...</p>
      ) : cases.length === 0 ? (
        <p className="no-cases-message">No cases found</p>
      ) : (
        <div className="cases-grid">
          {cases.map((item) => (
            <div key={item._id} className="case-card">
              <h3>{item.title}</h3>
              <p><strong>Client:</strong> {item.client?.username || "N/A"}</p>
              <p><strong>Status:</strong> {item.status}</p>
              <button onClick={() => navigate(`/lawyerdashboard/case-details/${item._id}`)}>
                View Details
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
