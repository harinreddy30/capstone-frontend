import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import io from 'socket.io-client';

// Initialize the socket connection
const socket = io('http://localhost:3000'); // Your backend API URL

const PrivateChat = () => {
  const { user } = useSelector((state) => state.auth);
  const { targetUser } = useParams(); // Get target user from URL
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    // Join the private chat with the target user
    socket.emit('joinPrivateRoom', { username: user.fname, targetUser });

    // Receive private messages
    socket.on('privateMessage', (msg) => {
      setMessages((prevMessages) => [...prevMessages, msg]);
    });

    return () => {
      socket.disconnect();
    };
  }, [user, targetUser]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (message.trim()) {
      const msg = {
        username: user.fname,
        text: message,
        time: new Date().toLocaleTimeString(),
      };
      socket.emit('privateMessage', { targetUser, msg }); // Emit to the private user
      setMessage('');
    }
  };

  return (
    <div className="private-chat">
      <div className="chat-messages">
        {messages.map((msg, index) => (
          <div key={index} className={msg.username === user.fname ? 'message self' : 'message'}>
            <strong>{msg.username}</strong>: {msg.text} <span>{msg.time}</span>
          </div>
        ))}
      </div>

      <form onSubmit={sendMessage} className="chat-form">
        <input
          type="text"
          placeholder="Type your message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
};

export default PrivateChat;
