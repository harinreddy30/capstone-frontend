import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserGroups } from '../../redux/action/groupAction';
import { useNavigate } from 'react-router-dom';

const ChatGroup = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { groups, loading, error } = useSelector((state) => state.groups);
  console.log("Groups from Redux:", groups);  // Log the groups
  
  useEffect(() => {
    dispatch(fetchUserGroups());
  }, [dispatch]);

  const handleGroupClick = (groupId) => {
    navigate(`/employee/chat-group/${groupId}`);
  };

  if (loading) return <p className="p-4">Loading groups...</p>;
  if (error) return <p className="p-4 text-red-600">Error fetching groups: {error}</p>;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Your Groups</h2>
      {groups.length === 0 ? (
        <p>No groups joined yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {groups.map((group) => (
            <div
              key={group._id}
              className="bg-white rounded-lg shadow-md p-4 cursor-pointer hover:shadow-lg transition-shadow duration-300"
              onClick={() => handleGroupClick(group._id)}
            >
              <h3 className="text-xl font-semibold mb-2">{group.name}</h3>
              <p className="text-gray-600 mb-2">{group.description}</p>
              <button className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition-colors duration-300">
                Join Chat
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ChatGroup;