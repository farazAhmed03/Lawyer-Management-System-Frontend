import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import defaultImg from "../../Asserts/Img/man1.svg";
import "./Appointment.css";
import BASE_URL from "../../Config/Api";
import LoadingSpinner from "../../Components/Common/Spinner";

export default function AppointmentForm() {
  const { lawyerId } = useParams();
  const navigate = useNavigate();
  const [lawyer, setLawyer] = useState(null);
  const [date, setDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  const handleApiError = useCallback((error, defaultMessage) => {
    console.error(error);
    if (error.response) {
      const message = error.response.data.message || defaultMessage;
      if (error.response.status === 404) {
        toast.error("Lawyer not found");
        navigate("/lawyers");
      } else {
        toast.error(message);
      }
    } else {
      toast.error("Network error. Please try again.");
    }
  }, [navigate]);

  useEffect(() => {
    const fetchLawyerData = async () => {
      try {
        const id = lawyerId || localStorage.getItem("selectedLawyerId");
        if (!id) {
          toast.error("No lawyer selected!");
          navigate("/lawyers");
          return;
        }

        const res = await axios.get(`${BASE_URL}/users/SingleUser/${id}`, {
          withCredentials: true,
        });
        setLawyer(res.data.data);
      } catch (err) {
        handleApiError(err, "Failed to fetch lawyer details");
      }
    };

    fetchLawyerData();
  }, [lawyerId, navigate, handleApiError]); // ✅ Clean now

  const validateForm = () => {
    const errors = {};
    if (!date) errors.date = "Please select date and time";
    if (new Date(date) < new Date()) errors.date = "Cannot book in the past";
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const finalId = lawyerId || localStorage.getItem("selectedLawyerId");
      const response = await axios.post(
        `${BASE_URL}/appointment/${finalId}`,
        { date },
        { withCredentials: true }
      );

      toast.success("Appointment booked successfully!");
      localStorage.removeItem("selectedLawyerId");
      setTimeout(() => navigate("/dashboard/myappointments"), 1500);
    } catch (err) {
      handleApiError(err, "Failed to book appointment");
    } finally {
      setLoading(false);
    }
  };

  if (!lawyer) return <LoadingSpinner />;

  return (
    <div className="appointment-container">
      <div className="appointment-card">
        <h2>Book Appointment</h2>

        <div className="lawyer-info">
          <img
            src={lawyer.image || defaultImg}
            alt={lawyer.username}
            className="profile-img"
          />
          <p><strong>Name:</strong> {lawyer.username}</p>
          <p><strong>Specialization:</strong> {lawyer.specialization || "N/A"}</p>
          <p><strong>Location:</strong> {lawyer.profile?.location || "Not Provided"}</p>
        </div>

        <form onSubmit={handleSubmit} className="appointment-form">
          <div className="form-group">
            <label>Select Date & Time:</label>
            <input
              type="datetime-local"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className={validationErrors.date ? "error" : ""}
              min={new Date().toISOString().slice(0, 16)}
              required
            />
            {validationErrors.date && (
              <span className="error-message">{validationErrors.date}</span>
            )}
          </div>

          <div className="button-group">
            <button type="submit" disabled={loading}>
              {loading ? <LoadingSpinner small /> : "Confirm Booking"}
            </button>
            <button
              type="button"
              className="back-btn"
              onClick={() => navigate(-1)}
              disabled={loading}
            >
              ← Back
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
