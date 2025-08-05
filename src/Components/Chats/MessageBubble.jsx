import "./MessageBubble.css";

function MessageBubble({ msg }) {
  const user = JSON.parse(localStorage.getItem("user"));
  const isSender = msg?.sender?._id === user?._id;

  return (
    <div className={`message-bubble ${isSender ? "sent" : "received"}`}>
      <p className="message-content">
        {msg.content}
        {isSender && (
          <span style={{ marginLeft: 6 }}>
            {msg?.isRead ? (
              <span style={{ color: "#4fc3f7" }}>✔✔</span>
            ) : (
              <span>✔</span>
            )}
          </span>
        )}
      </p>
      <small className="message-time">
        {new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
      </small>
    </div>
  );
}

export default MessageBubble;
