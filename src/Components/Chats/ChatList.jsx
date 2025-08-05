import React, { useEffect, useState } from 'react';
import axios from 'axios';
import BASE_URL from '../../Config/Api';
import { useNavigate } from 'react-router-dom';

function ChatList({ onSelectChat, selectedParticipantId, directLawyer }) {
    const [chats, setChats] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchChats = async () => {
            try {
                const res = await axios.get(`${BASE_URL}/chat/list`, { withCredentials: true });
                setChats(res.data.data);
            } catch (err) {
                console.log(err);
            }
        };
        fetchChats();
    }, []);

    useEffect(() => {
        if (!selectedParticipantId) return;

        if (directLawyer && directLawyer.participant?._id === selectedParticipantId) {
            onSelectChat(directLawyer);
        } else {
            const foundChat = chats.find(chat => chat.participant?._id === selectedParticipantId);
            if (foundChat) {
                onSelectChat(foundChat);
            }
        }
    }, [selectedParticipantId, chats, directLawyer, onSelectChat]);

    const handleSelectChat = (chat) => {
        navigate(`/chat/${chat.participant?._id}`);
        onSelectChat(chat);
    };

    const isAlreadyInChat = chats.some(chat => chat.participant?._id === directLawyer?.participant?._id);

    return (
        <div className="chat-list">
            <h4>Chats</h4>

            {!isAlreadyInChat && directLawyer && (
                <div
                    key={directLawyer.participant._id}
                    className={`chat-item ${directLawyer.participant._id === selectedParticipantId ? 'selected' : ''}`}
                    onClick={() => handleSelectChat(directLawyer)}
                >
                    <img
                        src={directLawyer.participant.image || 'https://via.placeholder.com/40'}
                        alt="profile"
                        className="chat-avatar"
                    />
                    <div className="chat-info">
                        <p>{directLawyer.participant.username}</p>
                        <small>Start new chat...</small>
                    </div>
                </div>
            )}

            {chats.map(chat => (
                <div
                    key={chat.chatId}
                    className={`chat-item ${chat.participant?._id === selectedParticipantId ? 'selected' : ''}`}
                    onClick={() => handleSelectChat(chat)}
                >
                    <img
                        src={chat.participant?.image || 'https://via.placeholder.com/40'}
                        alt="profile"
                        className="chat-avatar"
                    />
                    <div className="chat-info">
                        <p>{chat.participant?.username}</p>
                        <small>{chat.lastMessage?.content?.slice(0, 20)}...</small>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default ChatList;
