import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllUsers, updateUser } from "../../redux/action/userAction";
import Layout from "../../components/Layout/Layout";

const ProfileEdit = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { loading, error } = useSelector((state) => state.profile);

  const [successMessage, setSuccessMessage] = useState("");
  const [userForm, setUserForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    mobileNumber: "",
    birthDate: "",
    pronouns: "",
    employeeId: "",
    language: "English",
    profilePhoto: null,
  });

  // Load user data
  useEffect(() => {
    dispatch(fetchAllUsers());
  }, [dispatch]);

  useEffect(() => {
    if (user) {
      setUserForm({
        firstName: user.fname || "",
        lastName: user.lname || "",
        email: user.email || "",
        mobileNumber: user.phone || "",
        birthDate: user.dateOfBirth || "",
        pronouns: user.pronouns || "",
        employeeId: user.employeeId || "",
        language: user.language || "English",
        profilePhoto: user.profile || null,
      });
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUserForm((prev) => ({
          ...prev,
          profilePhoto: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage("");

    try {
      const result = await dispatch(updateUser(userForm));
      setSuccessMessage("Profile updated successfully!");
      dispatch(fetchAllUsers()); // Refresh user list
    } catch (error) {
      console.error("Error updating profile:", error);
      alert(error.message || "Failed to update profile");
    }
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-6">My Account</h2>

        <div className="flex gap-8">
          {/* Left Section - Form Fields */}
          <div className="flex-1">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    First Name (required)
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={userForm.firstName}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Last Name (required)
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={userForm.lastName}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={userForm.email}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Mobile Number
                  </label>
                  <input
                    type="tel"
                    name="mobileNumber"
                    value={userForm.mobileNumber}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Birth Date
                  </label>
                  <input
                    type="date"
                    name="birthDate"
                    value={userForm.birthDate}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Pronouns
                  </label>
                  <select
                    name="pronouns"
                    value={userForm.pronouns}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  >
                    <option value="Prefer not to share">Prefer not to share</option>
                    <option value="He/Him">He/Him</option>
                    <option value="She/Her">She/Her</option>
                    <option value="They/Them">They/Them</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors"
              >
                Save Changes
              </button>
            </form>
          </div>

          {/* Right Section - Profile Photo */}
          <div className="w-80">
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-2">Profile Photo</h3>
              <div className="flex items-center space-x-4">
                <img
                  src={userForm.profilePhoto || "/default-avatar.png"}
                  alt="Profile"
                  className="w-20 h-20 rounded-full object-cover"
                />
                <label className="cursor-pointer bg-gray-100 px-4 py-2 rounded-md hover:bg-gray-200">
                  Upload photo
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                  />
                </label>
              </div>
            </div>
          </div>
        </div>

        {successMessage && (
          <p className="text-green-600 text-center mt-4">{successMessage}</p>
        )}
      </div>
    </Layout>
  );
};

export default ProfileEdit;
