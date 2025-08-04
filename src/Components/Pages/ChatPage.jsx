import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import ChatList from '../Chats/ChatList';
import ChatWindow from '../Chats/ChatWindow';
import BASE_URL from '../../Config/Api';
import '../Chats/Chat.css';

function ChatPage({ socket }) {
    const { id } = useParams();
    const [selectedChat, setSelectedChat] = useState(null);
    const [directLawyer, setDirectLawyer] = useState(null);

    useEffect(() => {
        if (id) {
            fetchLawyerInfo(id);
        }
    }, [id]);

    const fetchLawyerInfo = async (lawyerId) => {
        try {
            const res = await axios.get(`${BASE_URL}/users/SingleUser/${lawyerId}`, { withCredentials: true });
            setDirectLawyer({
                participant: res.data.data
            });
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <div className="chat-container">
            <div className="chat-list">
                <ChatList
                    onSelectChat={setSelectedChat}
                    selectedParticipantId={id}
                    directLawyer={directLawyer}
                />
            </div>
            <div className="chat-window">
                <ChatWindow selectedChat={selectedChat} socket={socket} />
            </div>
        </div>
    );
}

export default ChatPage;
