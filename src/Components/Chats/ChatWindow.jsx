import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import MessageBubble from './MessageBubble';
import MessageInput from './MessageInput';
import BASE_URL from '../../Config/Api';

function ChatWindow({ selectedChat, socket }) {
    const [messages, setMessages] = useState([]);
    const messagesEndRef = useRef(null);

    // Fetch Messages API
    useEffect(() => {
        const fetchMessages = async () => {
            if (!selectedChat) return;
            try {
                const res = await axios.get(`${BASE_URL}/chat/messages/${selectedChat.participant._id}`, { withCredentials: true });
                setMessages(res.data.data);
            } catch (err) {
                console.log(err);
            }
        };
        fetchMessages();
    }, [selectedChat]);

    // Listen for new message in real-time
    useEffect(() => {
        if (!socket) return;
        socket.on('receiveMessage', (message) => {
            setMessages(prev => [...prev, message]);
        });
        return () => {
            socket.off('receiveMessage');
        };
    }, [socket]);

    // Auto Scroll
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // Clear Chat
    const handleClearChat = async () => {
        try {
            await axios.delete(`${BASE_URL}/chat/messages/${selectedChat.participant._id}/clear`, { withCredentials: true });
            setMessages([]);
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <div className="chat-window">
            {selectedChat ? (
                <>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 10px' }}>
                        <h5>{selectedChat.participant.username}</h5>
                        <button onClick={handleClearChat} className="clear-chat-btn">Clear Chat</button>
                    </div>

                    <div className="messages">
                        {messages.map(msg => (
                            <MessageBubble key={msg._id} msg={msg} />
                        ))}
                        <div ref={messagesEndRef}></div>
                    </div>

                    <MessageInput selectedChat={selectedChat} socket={socket} setMessages={setMessages} />
                </>
            ) : (
                <div className="no-chat">Select a chat to start messaging</div>
            )}
        </div>
    );
}

export default ChatWindow;
