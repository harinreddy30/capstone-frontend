import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchUserGroups } from '../../redux/action/groupAction';
import socket from '../../utilis/socket';  // Ensure the socket is correctly imported
import { currentGroupSet } from '../../redux/slices/groupSlice';

const GroupChatPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { groupId } = useParams();
  const { groups, loading, error } = useSelector((state) => state.groups);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);

  // Find current group
  const currentGroup = groups.find((group) => group._id === groupId);

  useEffect(() => {
    if (!currentGroup) {
      navigate('/chat');
    } else {
      // Fetch group messages and users when component mounts
      dispatch(currentGroupSet(currentGroup));

      if (socket) { // Ensure socket is defined before using it
        socket.emit('joinGroup', groupId); // Join the group in the socket room

        // Listen for new messages
        socket.on('message', (newMessage) => {
          setMessages((prevMessages) => [...prevMessages, newMessage]);
        });

        // Fetch the list of users
        setUsers(currentGroup.members);
      }
    }

    // Cleanup socket listener on component unmount
    return () => {
      if (socket) {
        socket.off('message');
      }
    };
  }, [dispatch, groupId, currentGroup, navigate, groups]);

  const handleSendMessage = () => {
    if (message.trim()) {
      if (socket) { // Ensure socket is defined before emitting the message
        socket.emit('sendMessage', { message, groupId }); // Send the message to the group
        setMessage('');
      }
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="group-chat-page">
      <div className="group-chat-header">
        <h1>{currentGroup ? currentGroup.name : 'Group Chat'}</h1>
        <div className="group-users">
          <h3>Users:</h3>
          <ul>
            {users.map((user) => (
              <li key={user._id}>{user.fname} {user.lname}</li>
            ))}
          </ul>
        </div>
      </div>
      <div className="group-chat-body">
        <div className="messages">
          {messages.map((msg, idx) => (
            <div key={idx} className={`message ${msg.sender === 'me' ? 'mine' : ''}`}>
              <strong>{msg.sender === 'me' ? 'You' : msg.sender}:</strong> {msg.content}
            </div>
          ))}
        </div>
      </div>
      <div className="group-chat-footer">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
        />
        <button onClick={handleSendMessage}>Send</button>
      </div>
    </div>
  );
};

export default GroupChatPage;
