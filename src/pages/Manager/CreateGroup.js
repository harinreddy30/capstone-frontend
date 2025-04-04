import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createGroup, fetchGroups, deleteGroup } from "../../redux/action/groupAction";
import { Link } from "react-router-dom";

const GroupManagement = () => {
  const dispatch = useDispatch();
  const [groupName, setGroupName] = useState("");
  const [groupDescription, setGroupDescription] = useState("");
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [groupToDelete, setGroupToDelete] = useState(null);
  const { groups } = useSelector((state) => state.groups);

  useEffect(() => {
    dispatch(fetchGroups());
  }, [dispatch]);

  const handleCreateGroup = (e) => {
    e.preventDefault();
    const groupData = { name: groupName, description: groupDescription };
    dispatch(createGroup(groupData));
    setGroupName("");
    setGroupDescription("");
  };

  const handleDeleteGroup = (group) => {
    setGroupToDelete(group);
    setShowConfirmDelete(true);
  };

  const confirmDeleteGroup = () => {
    if (groupToDelete && groupToDelete._id) {
      dispatch(deleteGroup(groupToDelete._id));
    }
    setShowConfirmDelete(false);
    setGroupToDelete(null);
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
                onClick={() => handleDeleteGroup(group)}
                className="p-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                DELETE
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Delete Confirmation Modal */}
      {showConfirmDelete && groupToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Delete Group</h3>
            <p className="text-gray-600 mb-2">
              Are you sure you want to delete the group "{groupToDelete.name}"?
            </p>
            <p className="text-red-600 text-sm mb-6">
              This action cannot be undone. All group chats and messages will be permanently deleted.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => {
                  setShowConfirmDelete(false);
                  setGroupToDelete(null);
                }}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 focus:outline-none"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteGroup}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GroupManagement;
