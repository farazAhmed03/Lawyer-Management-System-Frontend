import React from 'react';
import { Icon } from '@iconify/react';
import './LogoutButton.css';

export default function LogoutButton({ onLogout }) {
  return (
    <button className="nav-item logout-link" onClick={onLogout}>
      <Icon icon="mdi:logout" width={20} />
      Logout
    </button>
  );
}
