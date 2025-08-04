

import React from "react";
import "./Spinner.css";

export default function LoadingSpinner({ small }) {
  return (
    <div className={`spinner-container ${small ? "small" : ""}`}>
      <div className="loading-spinner"></div>
    </div>
  );
}
