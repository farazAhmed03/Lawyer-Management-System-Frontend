import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Lawyerdashboard.css";
import { toast, ToastContainer } from "react-toastify";
import { Icon } from "@iconify/react";
import handleError from "../../Utils/errorHandler";
import BASE_URL from "../../Config/Api";


export default function Lawyerdashboard() {
  const [appointmentStats, setAppointmentStats] = useState({});
  const [caseStats, setCaseStats] = useState({});

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/stats/lawyer`, {
          withCredentials: true,
        });

        const data = res.data.data;
        if (!data) return toast.error("No stats received");

        setAppointmentStats(data.appointmentStats || {});
        setCaseStats(data.caseStats || {});
      } catch (err) {
        handleError(err, "Failed to fetch stats");
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="lawyer-dashboard-wrapper">
      <ToastContainer />
      <h2 className="dashboard-title">📊 Lawyer Dashboard Overview</h2>

      {/* Appointments */}
      <h3 className="section-heading">📅 Appointment Stats</h3>
      <div className="stats-grid">
        <StatCard icon="mdi:calendar" title="Total Appointments" value={getTotal(appointmentStats)} />
        {renderStat("Approved Appointments", "mdi:check-circle-outline", appointmentStats.approved)}
        {renderStat("Pending Appointments", "mdi:clock-outline", appointmentStats.pending)}
        {renderStat("Rejected Appointments", "mdi:close-circle-outline", appointmentStats.rejected)}
      </div>

      {/* Cases */}
      <h3 className="section-heading" style={{ marginTop: "30px" }}>📁 Case Stats</h3>
      <div className="stats-grid">
        <StatCard icon="mdi:briefcase" title="Total Cases" value={getTotal(caseStats)} />
        {renderStat("Pending Cases", "mdi:clock-outline", caseStats.pending)}
        {renderStat("Accepted Cases", "mdi:check-circle-outline", caseStats.accepted)}
        {renderStat("In Progress", "mdi:progress-clock", caseStats.in_progress)}
        {renderStat("Rejected Cases", "mdi:close-circle-outline", caseStats.rejected)}
        {renderStat("Closed Cases", "mdi:lock-outline", caseStats.closed)}
        {renderStat("Dismissed Cases", "mdi:cancel", caseStats.dismissed)}
      </div>
    </div>
  );
}


// Function to calculate the total value of a given object
const getTotal = (obj = {}) => {
  let total = 0;
  for (let key in obj) {
    total += obj[key] || 0;
  }
  return total;
};

// Function to render a stat card
function StatCard({ icon, title, value }) {
  return (
    <div className="stat-card">
      <Icon icon={icon} width="40" />
      <h3>{title}</h3>
      <p>{value || 0}</p>
    </div>
  );
}

// Function to render a stat
const renderStat = (title, icon, value) => (
  <StatCard icon={icon} title={title} value={value || 0} />
);
