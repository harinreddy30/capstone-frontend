import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserGroups } from '../../redux/action/groupAction';
import { useNavigate, useLocation } from 'react-router-dom';

const ChatGroup = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { groups, loading, error } = useSelector((state) => state.groups);

  useEffect(() => {
    dispatch(fetchUserGroups());
  }, [dispatch]);

  const role = location.pathname.split('/')[1];

  const handleGroupClick = (groupId) => {
    navigate(`/${role}/chat-group/${groupId}`);
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-60">
        <div className="w-10 h-10 border-4 border-blue-500 border-dotted rounded-full animate-spin" />
      </div>
    );

  if (error)
    return (
      <p className="p-4 text-red-600 font-semibold bg-red-100 rounded-md">
        Error fetching groups: {error}
      </p>
    );

  return (
    <div className="p-6 min-h-screen bg-white">
      <h2 className="text-4xl font-extrabold text-center text-blue-700 mb-10 drop-shadow">
        ✨ Your Chat Groups
      </h2>

      {groups.length === 0 ? (
        <p className="text-center text-gray-600 text-lg">No groups joined yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {groups.map((group) => (
            <div
              key={group._id}
              onClick={() => handleGroupClick(group._id)}
              className="bg-white border border-gray-200 hover:border-blue-400 shadow-md rounded-2xl p-6 cursor-pointer transform hover:-translate-y-1 hover:scale-105 transition-all duration-300"
            >
              <h3 className="text-2xl font-bold text-blue-800 mb-2">{group.name}</h3>
              <p className="text-gray-700 mb-4">{group.description}</p>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleGroupClick(group._id);
                }}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-xl transition-all duration-300 shadow-sm"
              >
                🚀 Join Chat
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ChatGroup;
