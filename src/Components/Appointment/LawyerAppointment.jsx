import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import "bootstrap/dist/css/bootstrap.min.css";
import "./LawyerAppointments.css";
import BASE_URL from "../../Config/Api";

export default function LawyerAppointments() {
  const [appointments, setAppointments] = useState([]);

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
      console.error(err);
      toast.error("Failed to load appointments");
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      await axios.put(
        `${BASE_URL}/appointment/${id}`,
        { status },
        { withCredentials: true }
      );
      toast.success(`Appointment ${status} successfully`);
      fetchAppointments();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to update appointment");
    }
  };

  const formatDate = (date) => new Date(date).toLocaleString();

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">Your Appointments</h2>

      {appointments.length === 0 ? (
        <p className="text-center">No appointments found.</p>
      ) : (
        <div className="table-responsive">
          <Table striped bordered hover responsive>
            <thead className="table-dark">
              <tr>
                <th>#</th>
                <th>Client</th>
                <th>Email</th>
                <th>Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((appt, index) => {
                const isExpired = new Date(appt.date) < new Date();

                return (
                  <tr key={appt._id}>
                    <td>{index + 1}</td>
                    <td>{appt.client?.username}</td>
                    <td>{appt.client?.email}</td>
                    <td>{formatDate(appt.date)}</td>
                    <td>
                      <span
                        className={`badge ${
                          appt.status === "approved"
                            ? "bg-success"
                            : appt.status === "rejected"
                            ? "bg-danger"
                            : "bg-warning text-dark"
                        }`}
                      >
                        {appt.status}
                      </span>
                    </td>
                    <td>
                      {isExpired ? (
                        <span className="text-danger fw-bold">Expired</span>
                      ) : appt.status === "pending" ? (
                        <>
                          <Button
                            variant="success"
                            size="lg"
                            className="me-2"
                            onClick={() => handleStatusChange(appt._id, "approved")}
                          >
                            Accept
                          </Button>
                          <Button
                            variant="danger"
                            size="lg"
                            onClick={() => handleStatusChange(appt._id, "rejected")}
                          >
                            Reject
                          </Button>
                        </>
                      ) : (
                        <span className="fw-bold">Finalized</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </div>
      )}
    </div>
  );
}