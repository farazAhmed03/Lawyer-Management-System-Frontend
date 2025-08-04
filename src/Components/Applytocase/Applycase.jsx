import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "./Applycase.css";
import BASE_URL from "../../Config/Api";
import handleError from "../../Utils/errorHandler";

export default function SubmitCase() {
  const { appointmentId } = useParams();
  const navigate = useNavigate();

  const [user, setUser] = useState({});
  const [appointment, setAppointment] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    file: null,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getUser();
    getAppointment();
  }, []);

  const getUser = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/auth/profile`, {
        withCredentials: true,
      });
      setUser(res.data.data);
    } catch (err) {
      handleError(err, "Please login first");
      navigate("/", { replace: true });
    }
  };

  const getAppointment = async () => {
    try {
      const res = await axios.get(
        `${BASE_URL}/appointment/${appointmentId}`,
        { withCredentials: true }
      );
      setAppointment(res.data.data);
    } catch (err) {
      handleError(err, "Failed to fetch appointment");
      navigate("/", { replace: true });
    }
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = new FormData();
    payload.append("title", formData.title);
    payload.append("description", formData.description);
    payload.append("file", formData.file);

    try {
      setLoading(true);
      
      const res = await axios.post(
        `${BASE_URL}/case/${appointmentId}`,
        payload,
        { withCredentials: true,
          headers: {
            'Content-Type': 'multipart/form-data',
        },
         },
        
      );

      toast.success(res.data.data.message || "Case submitted");
      setTimeout(() => navigate("/dashboard/mycase"), 1500);
    } catch (err) {
      handleError(err, "Submission failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="submit-case-container">
      <h2>📤 Submit Your Case</h2>

      <form onSubmit={handleSubmit} className="submit-case-form">
        <fieldset disabled={loading}>
          <div className="form-group">
            <label>Full Name</label>
            <input type="text" value={user.username || ""} readOnly />
          </div>

          <div className="form-group">
            <label>Appointment</label>
            <input
              type="text"
              value={
                appointment
                  ? `${new Date(appointment.date).toLocaleString()} - ${appointment?.lawyer?.username}`
                  : "Loading..."
              }
              readOnly
            />
          </div>

          <div className="form-group">
            <label>Case Title</label>
            <input
              type="text"
              name="title"
              placeholder="Enter title"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              name="description"
              placeholder="Enter description"
              value={formData.description}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Upload Document</label>
            <input
              type="file"
              name="file"
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" disabled={loading}>
            {loading ? "Submitting..." : "Submit Case"}
          </button>
        </fieldset>
      </form>
    </div>
  );
}