import React from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import './layout.css';

import d1 from '../../../Asserts/Img/d1.svg';
import { Icon } from '@iconify/react';
import LogoutButton from '../Logout/LogoutButton';

export default function Layout() {
  const navigate = useNavigate();

  return (
    <div className="layout">
      <aside className="sidebar">
        <div className="logo">
          <img src={d1} alt="Logo" />
        </div>

        <nav>
          <ul className="nav-list">
            <li>
              <NavLink to="/dashboard" className="nav-item">
                <Icon icon="mdi:view-dashboard-outline" width={20} />
                Dashboard
              </NavLink>
            </li>

            <li>
              <NavLink to="/dashboard/myappointments" className="nav-item" onClick={() => console.log('Clicked')}>
                <Icon icon="mdi:calendar-outline" width={20} />
                My Appointments
              </NavLink>
            </li>


            <li>
              <NavLink to="/dashboard/mycase" className="nav-item">
                <Icon icon="mdi:briefcase-outline" width={20} />
                My Cases
              </NavLink>
            </li>
            <li>
              <NavLink to="/dashboard/myprofile" className="nav-item">
                <Icon icon="mdi:briefcase-outline" width={20} />
                My Profile
              </NavLink>
            </li>
            <li>
              <NavLink to="/dashboard/seelawyer" className="nav-item">
                <Icon icon="mdi:briefcase-outline" width={20} />
                All lawyers
              </NavLink>
            </li>

            <li>
              <a href="/payment" className="nav-item">
                <Icon icon="mdi:credit-card-outline" width={20} />
                Payment
              </a>
            </li>

            <li>
              <LogoutButton onLogout={() => {
                localStorage.clear();
                navigate('/lawyerlogin');
              }
              } />
            </li>
            
          </ul>
        </nav>
      </aside>

      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}
