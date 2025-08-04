import { useState } from 'react';
import axios from 'axios';
import BASE_URL from '../../Config/Api';

function MessageInput({ selectedChat, socket, setMessages }) {
    const [content, setContent] = useState('');

    const handleSend = async () => {
        if (!content.trim()) return;

        try {
            const res = await axios.post(`${BASE_URL}/chat/send-message`, {
                receiverId: selectedChat.participant._id,
                content
            }, { withCredentials: true });

            const newMessage = res.data.data;
            setMessages(prev => [...prev, newMessage]);
            socket.emit('sendMessage', newMessage);
            setContent('');
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <div className="message-input">
            <input
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Type a message..."
            />
            <button onClick={handleSend}>Send</button>
        </div>
    );
}

export default MessageInput;
