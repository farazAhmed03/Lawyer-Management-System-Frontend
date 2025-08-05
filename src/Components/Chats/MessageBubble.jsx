import React from "react";
import "./MessageBubble.css";

function MessageBubble({ msg }) {
  const isSender = msg?.sender?._id === JSON.parse(localStorage.getItem("user"))?._id;

  const tickIcon = isSender ? (
    <span style={{ marginLeft: 4 }}>
      {msg?.isRead ? (
        <span style={{ color: "#4fc3f7" }}>✔✔</span>
      ) : (
        <span>✔</span> 
      )}
    </span>
  ) : null;

  return (
    <div className={`message-bubble ${isSender ? "sent" : "received"}`}>
      <p className="message-content">
        {msg.content} {tickIcon}
      </p>
      <small className="message-time">
        {new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
      </small>
    </div>
  );
}

export default MessageBubble;
