import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMessages, joinGroup, updateOnlineUsers } from '../../redux/action/chatAction'; // Import actions
import { useNavigate } from 'react-router-dom'; // For navigation

const GroupsUsersPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate(); // Using useNavigate hook for navigation
    const { groups = [], onlineUsers = [], loading, error } = useSelector((state) => state.chat); // Defaulting to empty arrays if undefined
    
    // Handle private chat redirect
    const handlePrivateChat = (userId) => {
        navigate(`/private-chat/${userId}`); // Redirect to private chat page
    };

    // Handle joining a group
    const handleJoinGroup = (groupId) => {
        dispatch(joinGroup(groupId)); // Dispatch action to join the group
    };

    useEffect(() => {
        // You may fetch groups or online users here if needed
        dispatch(updateOnlineUsers()); // Update online users (Assuming you have a method for it)
    }, [dispatch]);

    return (
        <div className="chat-page">
            <div className="sidebar">
                <h3>Groups/Rooms</h3>
                {loading ? (
                    <p>Loading groups...</p>
                ) : (
                    <ul>
                        {groups && groups.length > 0 ? (
                            groups.map((group) => (
                                <li key={group._id}>
                                    <button onClick={() => handleJoinGroup(group._id)}>
                                        {group.name}
                                    </button>
                                </li>
                            ))
                        ) : (
                            <p>No groups available</p>
                        )}
                    </ul>
                )}
            </div>

            <div className="main-content">
                <h3>Available Users</h3>
                {loading ? (
                    <p>Loading users...</p>
                ) : (
                    <ul>
                        {onlineUsers && onlineUsers.length > 0 ? (
                            onlineUsers.map((user) => (
                                <li key={user._id}>
                                    <span>{user.name}</span>
                                    <button onClick={() => handlePrivateChat(user._id)}>
                                        Start Private Chat
                                    </button>
                                </li>
                            ))
                        ) : (
                            <p>No online users available</p>
                        )}
                    </ul>
                )}
                {error && <p>{error}</p>}
            </div>
        </div>
    );
};

export default GroupsUsersPage;
