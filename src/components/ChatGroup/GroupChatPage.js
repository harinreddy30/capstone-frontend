import React, { useEffect, useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchMessages, sendGroupMessage } from '../../redux/action/messageAction';
import { fetchGroupById } from '../../redux/action/groupAction';

import socket from '../../utilis/socket'; // Ensure the socket connection is correctly set up

const GroupChatPage = () => {
    const { groupId } = useParams();  // Get groupId from URL params
    const dispatch = useDispatch();
    const { messages, loading, error } = useSelector((state) => state.messages);
    const [newMessage, setNewMessage] = useState('');
    const messagesEndRef = useRef(null);  // For auto-scrolling to the bottom
    const group = useSelector((state) => state.groups?.currentGroup);  // Safe access
    console.log("Group data in Redux:", group);  // Log the group after dispatching

    const user = useSelector((state) => state.auth.user); // assuming you store user in Redux

    // Fetch group messages
    useEffect(() => {
        dispatch(fetchMessages(groupId));

        const token = localStorage.getItem("token"); // Or get it from Redux or any state management
        console.log('JWT Token:', token);
        
        // Authenticate the user with the token after connecting to the socket
        if (token) {
            socket.emit("authenticate", { token });
        }

        // Join the group room using socket
        socket.emit("joinRoom", { room: groupId });

        // Handle incoming group messages in real-time
        socket.on("receiveMessage", (data) => {
            console.log("Received message:", data);
            dispatch(fetchMessages(groupId)); // Refresh messages when a new one arrives
        });

        return () => {
            socket.off("receiveMessage");
            socket.emit("leaveRoom", { room: groupId }); // Optional but good practice
            // Clean up the socket listener
        };
    }, [dispatch, groupId]);

    // Scroll to the bottom when messages change
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    useEffect(() => {
        console.log('Group data in Redux:', group);  // Log to check if the group data is correctly set

        dispatch(fetchGroupById(groupId));
    }, [groupId]);

    // Send a new message to the group
    const handleSendMessage = () => {
        if (newMessage.trim() === '') return;

        // Optimistically update the UI by appending the message immediately
        const newMsg = {
            sender: {
                _id: user._id,
                fname: user.fname,
                lname: user.lname
            },
            message: newMessage,
            groupId,
            timestamp: new Date(),
        };
        dispatch(sendGroupMessage(newMessage, groupId));  // Send message via Redux action

        // Emit the message to the server via socket for real-time communication
        socket.emit("sendMessage", {
            message: newMessage,
            groupId,
            sender: {
                _id: user._id,
                fname: user.fname,
                lname: user.lname
            },  // You can send the actual sender ID if needed
        });
        console.log(newMessage)

        // Clear input after sending message
        setNewMessage('');

        // Scroll to the latest message
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    if (loading) return <p>Loading messages...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div className="chat-container p-4">
            <h2 className="text-3xl font-extrabold text-blue-600 mb-4">
            {group ? group?.name : "Loading group..."}
            </h2>
            <div className="messages-list overflow-auto h-96 p-4 border rounded-lg mb-4 flex flex-col-reverse">
                {messages.length > 0 ? (
                    messages.map((msg) => (
                        <div key={msg._id || msg.timestamp}
                            className={`message mb-2 flex ${msg.sender._id === user._id ? 'justify-end' : 'justify-start'}`}>
                            <div className={`message-content p-2 rounded-lg ${msg.sender._id === user._id ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>
                                <div className="sender font-bold">
                                    {msg.sender.fname} {msg.sender.lname}
                                </div>
                                <div className="message-text">{msg.message}</div>
                                {/* <div className="timestamp text-sm text-gray-500">{new Date(msg.timestamp).toLocaleTimeString()}</div> */}
                            </div>
                        </div>
                    ))
                ) : (
                    <p>No messages yet.</p>
                )}
                <div ref={messagesEndRef} />
            </div>

            <div className="message-input flex">
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-1 p-2 border rounded-l-lg"
                />
                <button
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim()}
                    className="bg-blue-500 text-white p-2 rounded-r-lg disabled:opacity-50"
                    >
                    Send
                </button>
            </div>
        </div>
    );
};

export default GroupChatPage;
