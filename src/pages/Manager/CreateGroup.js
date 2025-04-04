import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createGroup, fetchGroups, deleteGroup  } from "../../redux/action/groupAction"; // Assuming action for fetching groups
import { Link } from "react-router-dom";

const GroupManagement = () => {
  const dispatch = useDispatch();
  const [groupName, setGroupName] = useState("");
  const [groupDescription, setGroupDescription] = useState("");
  const { groups } = useSelector((state) => state.groups); // Assuming groups are stored in the Redux state

  useEffect(() => {
    dispatch(fetchGroups()); // Fetch all groups on component mount
  }, [dispatch]);

  const handleCreateGroup = (e) => {
    e.preventDefault();
    const groupData = { name: groupName, description: groupDescription };
    dispatch(createGroup(groupData)); // Create the group
  };

  const handleDeleteGroup = (groupId) => {
    if (window.confirm("Are you sure you want to delete this group?")) {
      dispatch(deleteGroup(groupId));
    }
  };
  

  return (
    <div className="container mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-3xl font-semibold text-gray-800 mb-4">Create Group</h2>
      <form onSubmit={handleCreateGroup} className="space-y-4 mb-8">
        <div>
          <input
            type="text"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            placeholder="Group Name"
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <textarea
            value={groupDescription}
            onChange={(e) => setGroupDescription(e.target.value)}
            placeholder="Group Description"
            rows="4"
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <button
            type="submit"
            className="w-full p-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Create Group
          </button>
        </div>
      </form>

      <h3 className="text-2xl font-semibold text-gray-800 mb-4">Available Groups</h3>
      <div className="space-y-4">
        {groups.map((group) => (
          <div key={group._id} className="flex items-center justify-between p-4 border border-gray-300 rounded-md">
            <div>
              <h4 className="text-xl font-semibold text-gray-800">{group.name}</h4>
              <p className="text-gray-600">{group.description}</p>
            </div>
            <div className="flex gap-2">
            <Link
              to={`/manager/group-info/${group._id}`}
              className="p-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              GROUP INFO
            </Link>
            <button
              onClick={() => handleDeleteGroup(group._id)}
              className="p-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              DELETE
            </button>
          </div>

          </div>
        ))}
      </div>
    </div>
  );
};

export default GroupManagement;
