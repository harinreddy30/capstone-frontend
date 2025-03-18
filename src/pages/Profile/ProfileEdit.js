import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateUser, fetchUserById } from "../../redux/action/userAction";
import { TextField, Button, MenuItem, Dialog, DialogTitle, DialogContent, DialogActions, IconButton, Avatar, Box, Typography, Tooltip } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { getUserIdFromToken } from "../../utilis/token";
import Layout from "../../components/Layout/Layout";
// Add Material UI icons
import CloseIcon from '@mui/icons-material/Close';
import SaveIcon from '@mui/icons-material/Save';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import CakeIcon from '@mui/icons-material/Cake';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import WorkIcon from '@mui/icons-material/Work';
import PaidIcon from '@mui/icons-material/Paid';
import LockIcon from '@mui/icons-material/Lock';

const ProfileEdit = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, loading, error } = useSelector((state) => state.users);
  console.log("Full Redux State:", user);

  const [formData, setFormData] = useState({
    fname: "",
    lname: "",
    dateOfBirth: "",
    email: "",
    phone: "",
    role: "",
    hourlyWage: "",
    address: {
      street: "",
      city: "",
      province: "",
      postalCode: "",
      country: "",
    },
    profile: null,
  });

  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);

  useEffect(() => {
    // Fetch user data when component mounts
    const userId = getUserIdFromToken();
    if (userId) {
      dispatch(fetchUserById(userId));
    }
  }, [dispatch]);

  useEffect(() => {
    console.log("User data from Redux:", user);

    if (user) {
      setFormData({
        fname: user.fname || "",
        lname: user.lname || "",
        dateOfBirth: user.dateOfBirth ? user.dateOfBirth.split("T")[0] : "",
        email: user.email || "",
        phone: user.phone || "",
        role: user.role || "",
        hourlyWage: user.hourlyWage || "",
        address: {
          street: user.address?.street || "",
          city: user.address?.city || "",
          province: user.address?.province || "",
          postalCode: user.address?.postalCode || "",
          country: user.address?.country || "",
        },
        profile: user.profile || null,
      });

      // Set preview image if user has a profile picture
      if (user.profile) {
        setPreviewImage(`http://localhost:3000${user.profile}`);
      }
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.startsWith("address.")) {
      const field = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        address: {
          ...prev.address,
          [field]: value,
        },
      }));
    } else if (name === "profile") {
      // Handle image change
      const file = e.target.files[0];
      setFormData((prev) => ({
        ...prev,
        profile: file, // Save the file in the form data
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        profile: file
      }));
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowConfirmDialog(true);
  };

  const handleConfirmSubmit = async () => {
    setShowConfirmDialog(false);
    const userId = getUserIdFromToken();
    if (userId) {
      const formDataToSubmit = new FormData();

      formDataToSubmit.append("fname", formData.fname);
      formDataToSubmit.append("lname", formData.lname);
      formDataToSubmit.append("dateOfBirth", formData.dateOfBirth);
      formDataToSubmit.append("email", formData.email);
      formDataToSubmit.append("phone", formData.phone);
      formDataToSubmit.append("role", formData.role);
      formDataToSubmit.append("hourlyWage", formData.hourlyWage);
      formDataToSubmit.append("address.street", formData.address.street);
      formDataToSubmit.append("address.city", formData.address.city);
      formDataToSubmit.append("address.province", formData.address.province);
      formDataToSubmit.append("address.postalCode", formData.address.postalCode);
      formDataToSubmit.append("address.country", formData.address.country);

      if (formData.profile instanceof File) {
        formDataToSubmit.append("profile", formData.profile);
      }

      try {
        const result = await dispatch(updateUser(userId, formDataToSubmit));
        console.log("Update result:", result);
        
        // Fetch updated user data
        await dispatch(fetchUserById(userId));
        
        // Navigate to profile view
        navigate('/profile/view');
      } catch (error) {
        console.error("Error updating profile:", error);
        // Show error message to user
        if (error.response?.status === 401) {
          // Handle unauthorized error
          console.error("Unauthorized. Please log in again.");
        } else {
          // Handle other errors
          console.error("Failed to update profile:", error.message);
        }
      }
    } else {
      console.error("User ID missing or invalid token.");
    }
  };

  // Helper function to determine if a field should be disabled
  const isFieldDisabled = (fieldName) => {
    // List of fields that employees cannot edit
    const restrictedFields = ['role', 'hourlyWage'];
    return restrictedFields.includes(fieldName);
  };

  // Render locked icon with tooltip for disabled fields
  const renderLockedIcon = () => (
    <Tooltip title="This field can only be modified by administrators">
      <LockIcon className="text-gray-400 ml-2" fontSize="small" />
    </Tooltip>
  );

  return (
    <Layout>
      <div className="min-h-screen bg-gray-100 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header Section */}
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            {loading ? (
              <div className="flex flex-col items-center justify-center p-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                <p className="mt-4 text-gray-600">Loading your profile information...</p>
              </div>
            ) : error ? (
              <div className="text-red-500 p-4 text-center bg-red-50 rounded-lg">
                <p className="font-semibold">Error loading profile</p>
                <p className="text-sm mt-1">{error}</p>
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={() => navigate(-1)}
                  className="mt-4"
                  startIcon={<ArrowBackIcon />}
                >
                  Go Back
                </Button>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center">
                    <IconButton onClick={() => navigate(-1)} className="mr-4">
                      <ArrowBackIcon />
                    </IconButton>
                    <Typography variant="h4" className="font-semibold text-gray-900">
                      Edit Profile
                    </Typography>
                  </div>
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={<SaveIcon />}
                    onClick={handleSubmit}
                    className="transition-all duration-300 hover:shadow-lg"
                  >
                    Save Changes
                  </Button>
                </div>

                {/* Profile Image Upload */}
                <div className="flex flex-col items-center mb-8">
                  <div className="relative group">
                    <Avatar
                      src={previewImage || (user?.profile ? `http://localhost:3000${user.profile}` : null)}
                      alt="Profile"
                      sx={{ width: 120, height: 120 }}
                      className="border-4 border-white shadow-lg transition-transform duration-300 group-hover:scale-105"
                    >
                      {!previewImage && !user?.profile && <PersonIcon sx={{ fontSize: 60 }} />}
                    </Avatar>
                    <label className="absolute bottom-0 right-0 bg-blue-500 text-white p-2 rounded-full cursor-pointer shadow-lg transition-all duration-300 hover:bg-blue-600">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                      <CloudUploadIcon />
                    </label>
                  </div>
                  <Typography variant="body2" className="text-gray-500 mt-2">
                    Click to upload a new profile picture
                  </Typography>
                </div>

                {/* Form Grid */}
                <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Personal Information */}
                  <div className="space-y-4">
                    <Typography variant="h6" className="text-gray-900 font-semibold mb-4">
                      Personal Information
                    </Typography>
                    <TextField
                      label="First Name"
                      name="fname"
                      value={formData.fname}
                      onChange={handleChange}
                      fullWidth
                      InputProps={{
                        startAdornment: <PersonIcon className="text-gray-400 mr-2" />
                      }}
                    />
                    <TextField
                      label="Last Name"
                      name="lname"
                      value={formData.lname}
                      onChange={handleChange}
                      fullWidth
                      InputProps={{
                        startAdornment: <PersonIcon className="text-gray-400 mr-2" />
                      }}
                    />
                    <TextField
                      label="Date of Birth"
                      name="dateOfBirth"
                      type="date"
                      value={formData.dateOfBirth}
                      onChange={handleChange}
                      fullWidth
                      InputLabelProps={{ shrink: true }}
                      InputProps={{
                        startAdornment: <CakeIcon className="text-gray-400 mr-2" />
                      }}
                    />
                  </div>

                  {/* Contact Information */}
                  <div className="space-y-4">
                    <Typography variant="h6" className="text-gray-900 font-semibold mb-4">
                      Contact Information
                    </Typography>
                    <TextField
                      label="Email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      fullWidth
                      InputProps={{
                        startAdornment: <EmailIcon className="text-gray-400 mr-2" />
                      }}
                    />
                    <TextField
                      label="Phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      fullWidth
                      InputProps={{
                        startAdornment: <PhoneIcon className="text-gray-400 mr-2" />
                      }}
                    />
                  </div>

                  {/* Work Information */}
                  <div className="space-y-4">
                    <Typography variant="h6" className="text-gray-900 font-semibold mb-4 flex items-center">
                      Work Information
                      {renderLockedIcon()}
                    </Typography>
                    <Tooltip title="This field can only be modified by administrators" placement="top">
                      <div>
                        <TextField
                          label="Role"
                          name="role"
                          value={formData.role}
                          onChange={handleChange}
                          fullWidth
                          disabled
                          InputProps={{
                            startAdornment: <WorkIcon className="text-gray-400 mr-2" />,
                            endAdornment: renderLockedIcon()
                          }}
                        />
                      </div>
                    </Tooltip>
                    <Tooltip title="This field can only be modified by administrators" placement="top">
                      <div>
                        <TextField
                          label="Hourly Wage"
                          name="hourlyWage"
                          type="number"
                          value={formData.hourlyWage}
                          onChange={handleChange}
                          fullWidth
                          disabled
                          InputProps={{
                            startAdornment: <PaidIcon className="text-gray-400 mr-2" />,
                            endAdornment: renderLockedIcon()
                          }}
                        />
                      </div>
                    </Tooltip>
                  </div>

                  {/* Address Information */}
                  <div className="space-y-4">
                    <Typography variant="h6" className="text-gray-900 font-semibold mb-4">
                      Address Information
                    </Typography>
                    <TextField
                      label="Street"
                      name="address.street"
                      value={formData.address.street}
                      onChange={handleChange}
                      fullWidth
                      InputProps={{
                        startAdornment: <LocationOnIcon className="text-gray-400 mr-2" />
                      }}
                    />
                    <TextField
                      label="City"
                      name="address.city"
                      value={formData.address.city}
                      onChange={handleChange}
                      fullWidth
                      InputProps={{
                        startAdornment: <LocationOnIcon className="text-gray-400 mr-2" />
                      }}
                    />
                    <TextField
                      label="Province"
                      name="address.province"
                      value={formData.address.province}
                      onChange={handleChange}
                      fullWidth
                      InputProps={{
                        startAdornment: <LocationOnIcon className="text-gray-400 mr-2" />
                      }}
                    />
                    <TextField
                      label="Postal Code"
                      name="address.postalCode"
                      value={formData.address.postalCode}
                      onChange={handleChange}
                      fullWidth
                      InputProps={{
                        startAdornment: <LocationOnIcon className="text-gray-400 mr-2" />
                      }}
                    />
                    <TextField
                      label="Country"
                      name="address.country"
                      value={formData.address.country}
                      onChange={handleChange}
                      fullWidth
                      InputProps={{
                        startAdornment: <LocationOnIcon className="text-gray-400 mr-2" />
                      }}
                    />
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Confirmation Dialog */}
      <Dialog
        open={showConfirmDialog}
        onClose={() => setShowConfirmDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle className="flex justify-between items-center">
          <Typography variant="h6">Confirm Changes</Typography>
          <IconButton onClick={() => setShowConfirmDialog(false)}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to save these changes to your profile? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowConfirmDialog(false)} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleConfirmSubmit} color="primary" variant="contained">
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
    </Layout>
  );
};

export default ProfileEdit;
