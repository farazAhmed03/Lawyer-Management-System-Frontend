import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import './Lawyerout.css';
import d1 from '../../../Asserts/Img/d1.svg';
import { toast } from 'react-toastify';
import { Icon } from '@iconify/react';
import LogoutButton from '../../Logout/LogoutButton';
import BASE_URL from '../../../Config/Api';
import axios from 'axios';

export default function LawyerLayout() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const closeSidebar = () => setSidebarOpen(false);

  const handleMyReviewsClick = () => {
    const lawyerId = localStorage.getItem('UserId');
    if (lawyerId) {
      navigate(`/lawyer-reviews/${lawyerId}`);
    } else {
      toast.error("Lawyer ID not found");
    }
  };

  return (
    <div className="layout">
      {/* Hamburger */}
      <div className="hamburger-icon" onClick={toggleSidebar}>
        <Icon icon="mdi:menu" width={28} />
      </div>

      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="logo">
          <img src={d1} alt="Logo" />
        </div>

        <nav>
          <ul className="nav-list" onClick={closeSidebar}>
            <li>
              <NavLink to="" className="nav-item">
                <Icon icon="mdi:view-dashboard-outline" width={20} />
                Dashboard
              </NavLink>
            </li>
            <li>
              <NavLink to="myappointments" className="nav-item">
                <Icon icon="mdi:calendar-outline" width={20} />
                My Appointments
              </NavLink>
            </li>
            <li>
              <NavLink to="lawyercase" className="nav-item">
                <Icon icon="mdi:briefcase-outline" width={20} />
                My Cases
              </NavLink>
            </li>
            <li>
              <NavLink to="lawyerprofilem" className="nav-item">
                <Icon icon="mdi:account-outline" width={20} />
                My Profile
              </NavLink>
            </li>
            <li>
              <NavLink to="/chat" className="nav-item">
                <Icon icon="mdi:message-outline" width={20} />
                My Chats
              </NavLink>
            </li>
            <li>
              <button className="nav-item nav-btn" onClick={handleMyReviewsClick}>
                <Icon icon="mdi:star-outline" width={20} />
                My Reviews
              </button>
            </li>
            <li>
              <LogoutButton
                onLogout={async () => {
                  try {
                    await axios.post(`${BASE_URL}/auth/logout`, {}, {
                      withCredentials: true,
                    });
                    localStorage.clear();
                    toast.success("Logged out successfully");
                    setTimeout(() => navigate("/"), 1500);
                  } catch (err) {
                    toast.error("Logout failed");
                    console.error(err);
                  }
                }}
              />
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="main-content" onClick={closeSidebar}>
        <Outlet />
      </main>
    </div>
  );
}
