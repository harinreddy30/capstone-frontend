// src/pages/AddMembersToGroup.js
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllUsers } from "../../redux/action/userAction";
import { joinGroup, fetchGroupById, removeUserFromGroup } from "../../redux/action/groupAction";
import { useParams } from "react-router-dom";

const AddMembersToGroup = () => {
  const dispatch = useDispatch();
  const { groupId } = useParams();

  const users = useSelector((state) => state.users.users);
  const group = useSelector((state) => state.groups.currentGroup);
  
  console.log("Group from Redux:", group);
  const loading = useSelector((state) => state.groups.loading);

  useEffect(() => {
    dispatch(fetchAllUsers());
    dispatch(fetchGroupById(groupId));
  }, [dispatch, groupId]);

  const handleAddUser = (userId) => {
    dispatch(joinGroup(groupId, userId)).then(() => {
      dispatch(fetchGroupById(groupId));
    });
  };

  const handleRemoveUser = (userId) => {
    dispatch(removeUserFromGroup(groupId, userId)).then(() => {
      dispatch(fetchGroupById(groupId));
    });
  };

  const isUserInGroup = (userId) => group?.members?.some(member => member._id === userId);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold text-blue-700 mb-4">
        Manage Members - {group?.name || "Loading..."}
      </h2>

      <div className="mb-4 text-lg text-gray-700">
        <strong>Total Members:</strong> {group?.members?.length || 0}
      </div>

      {/* {loading && <p className="text-gray-500">Loading users...</p>} */}

      <div className="bg-white shadow-md rounded-lg p-4 space-y-4">
        {users?.length > 0 ? (
          users.map((user) => (
            <div
              key={user._id}
              className="flex justify-between items-center border-b pb-2"
            >
              <div>
                <p className="text-md font-medium">{user.name}</p>
                <p className="text-sm text-gray-500">{user.email}</p>
              </div>

              {isUserInGroup(user._id) ? (
                <button
                  onClick={() => handleRemoveUser(user._id)}
                  className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600"
                >
                  Remove
                </button>
              ) : (
                <button
                  onClick={() => handleAddUser(user._id)}
                  className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600"
                >
                  Add
                </button>
              )}
            </div>
          ))
        ) : (
          <p>No users found.</p>
        )}
      </div>
    </div>
  );
};

export default AddMembersToGroup;