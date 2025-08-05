import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import BASE_URL from "../../../Config/Api";
import handleError from "../../../Utils/errorHandler";
import "./Mycase.css";

export default function MyCases() {
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCases();
  }, []);

  const fetchCases = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/case/`, {
        withCredentials: true,
      });
      const casesData = response.data.data || [];

      const updatedCases = await Promise.all(
        casesData.map(async (caseItem) => {
          if (caseItem.status?.toLowerCase() === "closed") {
            try {
              const res = await axios.get(
                `${BASE_URL}/rating-and-review/${caseItem.lawyer?._id}`,
                { withCredentials: true }
              );
              const existingReview = res.data?.reviews?.find(
                (rev) => rev.case?._id === caseItem._id
              );
              return { ...caseItem, reviewGiven: !!existingReview };
            } catch (error) {
              return { ...caseItem, reviewGiven: false };
            }
          }
          return caseItem;
        })
      );

      setCases(updatedCases);
    } catch (error) {
      handleError(error, "Failed to load cases");
      if (error.response?.status === 401 || error.response?.status === 403) {
        setTimeout(() => {
          window.location.href = "/login";
        }, 1500);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleReviewClick = (lawyerId, caseId) => {
    navigate(`/review/${lawyerId}/${caseId}`);
  };

  return (
    <div className="appointments-container">
      <h2 className="appointments-title">My Cases</h2>

      {loading ? (
        <p className="no-appointments">Loading cases...</p>
      ) : cases.length === 0 ? (
        <p className="no-appointments">No cases found yet.</p>
      ) : (
        <div className="table-wrapper">
          <table className="appointments-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Status</th>
                <th>Date</th>
                <th>File</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {cases.map((caseItem) => {
                const fileUrl = caseItem.file
                  ? `${BASE_URL.replace("/api/v1", "")}${caseItem.file}`
                  : null;

                return (
                  <tr key={caseItem._id}>
                    <td>{caseItem.title}</td>
                    <td>
                      <span className={`status ${caseItem.status?.toLowerCase()}`}>
                        {caseItem.status}
                      </span>
                    </td>
                    <td>{new Date(caseItem.createdAt).toLocaleString()}</td>
                    <td>
                      {fileUrl ? (
                        <a
                          href={fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          download
                          className="view-pdf-link"
                        >
                          View File
                        </a>
                      ) : (
                        "No File"
                      )}
                    </td>
                    <td>
                      {caseItem.status?.toLowerCase() === "closed" && (
                        caseItem.reviewGiven ? (
                          <button className="disabled-btn" disabled>
                            Review Submitted
                          </button>
                        ) : (
                          <button
                            className="review-btn"
                            onClick={() =>
                              handleReviewClick(caseItem.lawyer?._id, caseItem._id)
                            }
                          >
                            Give Review
                          </button>
                        )
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
