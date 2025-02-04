import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateProfile, fetchProfile } from '../../redux/action/profileAction';
import Layout from '../../components/Layout/Layout';

const ProfileEdit = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { loading, error } = useSelector((state) => state.profile);
  const [successMessage, setSuccessMessage] = useState('');
  
  const [profileForm, setProfileForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    mobileNumber: '',
    homeNumber: '',
    birthDate: '',
    pronouns: '',
    employeeId: '',
    language: 'English',
    profilePhoto: null
  });

  // Load initial data
  useEffect(() => {
    const loadProfile = async () => {
      try {
        console.log('Loading profile data...'); // Debug log
        await dispatch(fetchProfile());
      } catch (error) {
        console.error('Error loading profile:', error);
      }
    };
    loadProfile();
  }, [dispatch]);

  // Update form when user data changes
  useEffect(() => {
    console.log('User data changed:', user); // Debug log
    if (user) {
      setProfileForm({
        firstName: user.fname || '',
        lastName: user.lname || '',
        email: user.email || '',
        mobileNumber: user.phone || '',
        homeNumber: user.homePhone || '',
        birthDate: user.dateOfBirth || '',
        pronouns: user.pronouns || '',
        employeeId: user.employeeId || '',
        language: user.language || 'English',
        profilePhoto: user.profile || null
      });
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileForm(prev => ({
          ...prev,
          profilePhoto: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage('');
    
    try {
      console.log('Submitting form data:', profileForm); // Debug log
      const result = await dispatch(updateProfile(profileForm));
      console.log('Update result:', result); // Debug log
      
      setSuccessMessage('Profile updated successfully!');
      
      // Refresh profile data
      await dispatch(fetchProfile());
    } catch (error) {
      console.error('Error updating profile:', error);
      alert(error.message || 'Failed to update profile');
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
              {/* Name Fields */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    First name (required)
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={profileForm.firstName}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Last name (required)
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={profileForm.lastName}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={profileForm.email}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  required
                />
              </div>

              {/* Phone Numbers */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Mobile number
                  </label>
                  <input
                    type="tel"
                    name="mobileNumber"
                    value={profileForm.mobileNumber}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Home number
                  </label>
                  <input
                    type="tel"
                    name="homeNumber"
                    value={profileForm.homeNumber}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>
              </div>

              {/* Birth Date & Pronouns */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Birth date
                  </label>
                  <input
                    type="date"
                    name="birthDate"
                    value={profileForm.birthDate}
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
                    value={profileForm.pronouns}
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

              {/* Employee ID & Language */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Employee ID
                  </label>
                  <input
                    type="text"
                    name="employeeId"
                    value={profileForm.employeeId}
                    className="w-full p-2 border border-gray-300 rounded-md bg-gray-100"
                    disabled
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Language
                  </label>
                  <select
                    name="language"
                    value={profileForm.language}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  >
                    <option value="English">English</option>
                    <option value="French">French</option>
                    <option value="Spanish">Spanish</option>
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

          {/* Right Section - Profile Photo & Security */}
          <div className="w-80">
            {/* Profile Photo */}
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-2">Profile photo</h3>
              <div className="flex items-center space-x-4">
                <img
                  src={profileForm.profilePhoto || '/default-avatar.png'}
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

            {/* Security Section */}
            <div>
              <h3 className="text-lg font-medium mb-2">Login & Security</h3>
              <div className="space-y-4">
                <button
                  type="button"
                  className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-200 transition-colors"
                >
                  Change password
                </button>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Enable 2-step verification</span>
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProfileEdit;