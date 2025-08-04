import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import './MyAppointments.css';
import handleError from '../../../Utils/errorHandler';
import BASE_URL from '../../../Config/Api';

export default function MyAppointments() {
  const [appointments, setAppointments] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/appointment`, {
        withCredentials: true,
      });
      setAppointments(res.data.data || []);
    } catch (err) {
      handleError(err, 'Failed to fetch appointments');
    }
  };

  const handleSubmitCase = (appt) => {
    toast.info(`Proceed to submit case for ${appt.lawyer?.username}`);
    navigate(`/applycase/${appt._id}`);
  };

  return (
    <div className="appointments-container">
      <ToastContainer />
      <h2 className="appointments-title">My Appointments</h2>

      {appointments.length === 0 ? (
        <p className="no-appointments">No Appointments Found.</p>
      ) : (
        <table className="appointments-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Lawyer</th>
              <th>Specialization</th>
              <th>Status & Actions</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((appt) => {
              const isCaseSubmitted = appt.linkedCase !== null;

              return (
                <tr key={appt._id}>
                  <td>{new Date(appt.date).toLocaleString()}</td>
                  <td>{appt.lawyer?.username || 'N/A'}</td>
                  <td>{appt.lawyer?.specialization || 'N/A'}</td>
                  <td>
                    <span
                      className={`status ${appt.status === 'approved'
                          ? 'status-approved'
                          : appt.status === 'rejected'
                            ? 'status-rejected'
                            : 'status-pending'
                        }`}
                    >
                      {appt.status}
                    </span>

                    {appt.status === 'approved' && (
                      <button
                        className={`submit-case-btn ${isCaseSubmitted ? 'disabled' : ''}`}
                        onClick={() => handleSubmitCase(appt)}
                        disabled={isCaseSubmitted}
                      >
                        {isCaseSubmitted ? 'Already Submitted' : 'Submit Case'}
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}
