import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserById } from '../../redux/action/userAction';
import { useNavigate } from 'react-router-dom';
import { getUserIdFromToken } from "../../utilis/token";
import { Button, CircularProgress, Avatar } from "@mui/material";
import Layout from "../../components/Layout/Layout";
// Add Material UI icons
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import CakeIcon from '@mui/icons-material/Cake';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import WorkIcon from '@mui/icons-material/Work';
import PaidIcon from '@mui/icons-material/Paid';
import EditIcon from '@mui/icons-material/Edit';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import BadgeIcon from '@mui/icons-material/Badge';

const ProfileView = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [imageError, setImageError] = useState(false);

    const { user, loading, error } = useSelector((state) => state.users);
    const userId = getUserIdFromToken();

    useEffect(() => {
        if (userId) {
            dispatch(fetchUserById(userId));
        }
    }, [dispatch, userId]);

    // Log the loading, error, and user data
    console.log("Loading:", loading);
    console.log("Error:", error);
    console.log("User Data:", user);

    const handleEdit = () => {
        navigate('/profile/edit');
    };

    // Function to generate initials from name
    const getInitials = (fname, lname) => {
        return `${fname?.[0] || ''}${lname?.[0] || ''}`.toUpperCase();
    };

    // Function to generate a random pastel color based on name
    const getAvatarColor = (name) => {
        const colors = [
            'bg-gradient-to-br from-pink-400 to-rose-500',
            'bg-gradient-to-br from-blue-400 to-indigo-500',
            'bg-gradient-to-br from-green-400 to-emerald-500',
            'bg-gradient-to-br from-purple-400 to-violet-500',
            'bg-gradient-to-br from-yellow-400 to-amber-500'
        ];
        const index = name?.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % colors.length;
        return colors[index];
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center">
            <CircularProgress size={48} className="text-blue-500" />
        </div>
    );
    
    if (error) return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="text-center p-8 bg-red-50 rounded-lg">
                <p className="text-red-500 font-semibold text-lg mb-4">Error: {error?.message || error}</p>
                <Button
                    variant="outlined"
                    color="primary"
                    onClick={() => navigate(-1)}
                    startIcon={<ArrowBackIcon />}
                >
                    Go Back
                </Button>
            </div>
        </div>
    );

    return (
        <Layout>
            <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-8">
                <div className="max-w-4xl mx-auto px-4">
                    {/* Profile Header Card */}
                    <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8 transform transition-all duration-300 hover:shadow-2xl">
                        <div className="bg-gradient-to-r from-blue-500 via-blue-600 to-indigo-600 h-48 relative">
                            <div className="absolute inset-0 bg-black opacity-10"></div>
                            <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-black/20 to-transparent"></div>
                        </div>
                        <div className="relative px-8 pb-8">
                            <div className="flex flex-col sm:flex-row items-center">
                                <div className="-mt-20 mb-6 sm:mb-0">
                                    <div className="relative group">
                                        {!imageError ? (
                                            <img
                                                src={user?.profile ? `http://localhost:3000${user.profile}` : null}
                        alt="Profile"
                                                onError={() => setImageError(true)}
                                                className="w-40 h-40 rounded-2xl border-4 border-white shadow-xl object-cover transition-transform duration-300 group-hover:scale-105"
                                            />
                                        ) : (
                                            <div className={`w-40 h-40 rounded-2xl border-4 border-white shadow-xl flex items-center justify-center text-3xl font-bold text-white ${getAvatarColor(user?.fname)}`}>
                                                {getInitials(user?.fname, user?.lname)}
                                            </div>
                                        )}
                                        <div className="absolute inset-0 rounded-2xl bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
                                            <EditIcon className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                        </div>
                                    </div>
                                </div>
                                <div className="sm:ml-8 text-center sm:text-left flex-grow">
                                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                                        {user?.fname} {user?.lname}
                                    </h1>
                                    <div className="flex items-center justify-center sm:justify-start gap-2 mb-4">
                                        <BadgeIcon className="text-blue-500" />
                                        <p className="text-lg text-blue-600 font-medium">{user?.role}</p>
                                    </div>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        startIcon={<EditIcon />}
                                        onClick={handleEdit}
                                        className="shadow-lg hover:shadow-xl transition-all duration-300"
                                        sx={{
                                            background: 'linear-gradient(to right, #2563eb, #3b82f6)',
                                            '&:hover': {
                                                background: 'linear-gradient(to right, #1d4ed8, #2563eb)',
                                            },
                                        }}
                                    >
                                        Edit Profile
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Information Cards Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Contact Information */}
                        <div className="bg-white rounded-2xl shadow-lg p-8 transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                            <h2 className="text-2xl font-bold mb-6 text-gray-900 border-b pb-4">
                                Contact Information
                            </h2>
                            <div className="space-y-6">
                                <div className="flex items-center group">
                                    <div className="p-3 rounded-xl bg-blue-50 group-hover:bg-blue-100 transition-colors duration-300">
                                        <EmailIcon className="text-blue-500 transform group-hover:scale-110 transition-transform duration-300" />
                                    </div>
                                    <div className="ml-4">
                                        <p className="text-sm font-medium text-gray-500">Email</p>
                                        <p className="text-lg text-gray-900">{user?.email}</p>
                                    </div>
                                </div>
                                <div className="flex items-center group">
                                    <div className="p-3 rounded-xl bg-green-50 group-hover:bg-green-100 transition-colors duration-300">
                                        <PhoneIcon className="text-green-500 transform group-hover:scale-110 transition-transform duration-300" />
                                    </div>
                                    <div className="ml-4">
                                        <p className="text-sm font-medium text-gray-500">Phone</p>
                                        <p className="text-lg text-gray-900">{user?.phone}</p>
                                    </div>
                                </div>
                                <div className="flex items-center group">
                                    <div className="p-3 rounded-xl bg-purple-50 group-hover:bg-purple-100 transition-colors duration-300">
                                        <CakeIcon className="text-purple-500 transform group-hover:scale-110 transition-transform duration-300" />
                                    </div>
                                    <div className="ml-4">
                                        <p className="text-sm font-medium text-gray-500">Date of Birth</p>
                                        <p className="text-lg text-gray-900">
                                            {user?.dateOfBirth ? new Date(user.dateOfBirth).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            }) : 'Not set'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Work Information */}
                        <div className="bg-white rounded-2xl shadow-lg p-8 transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                            <h2 className="text-2xl font-bold mb-6 text-gray-900 border-b pb-4">
                                Work Information
                            </h2>
                            <div className="space-y-6">
                                <div className="flex items-center group">
                                    <div className="p-3 rounded-xl bg-indigo-50 group-hover:bg-indigo-100 transition-colors duration-300">
                                        <WorkIcon className="text-indigo-500 transform group-hover:scale-110 transition-transform duration-300" />
                                    </div>
                                    <div className="ml-4">
                                        <p className="text-sm font-medium text-gray-500">Role</p>
                                        <p className="text-lg text-gray-900">{user?.role}</p>
                                    </div>
                                </div>
                                <div className="flex items-center group">
                                    <div className="p-3 rounded-xl bg-amber-50 group-hover:bg-amber-100 transition-colors duration-300">
                                        <PaidIcon className="text-amber-500 transform group-hover:scale-110 transition-transform duration-300" />
                                    </div>
                                    <div className="ml-4">
                                        <p className="text-sm font-medium text-gray-500">Hourly Wage</p>
                                        <p className="text-lg text-gray-900">${user?.hourlyWage}/hr</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Address Information */}
                        <div className="bg-white rounded-2xl shadow-lg p-8 md:col-span-2 transform transition-all duration-300 hover:shadow-xl">
                            <h2 className="text-2xl font-bold mb-6 text-gray-900 border-b pb-4">
                                Address Information
                            </h2>
                            {user?.address ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="flex items-start group">
                                        <div className="p-3 rounded-xl bg-rose-50 group-hover:bg-rose-100 transition-colors duration-300">
                                            <LocationOnIcon className="text-rose-500 transform group-hover:scale-110 transition-transform duration-300" />
                                        </div>
                                        <div className="ml-4">
                                            <p className="text-sm font-medium text-gray-500">Street Address</p>
                                            <p className="text-lg text-gray-900">{user.address.street}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start group">
                                        <div className="p-3 rounded-xl bg-rose-50 group-hover:bg-rose-100 transition-colors duration-300">
                                            <LocationOnIcon className="text-rose-500 transform group-hover:scale-110 transition-transform duration-300" />
                                        </div>
                                        <div className="ml-4">
                                            <p className="text-sm font-medium text-gray-500">City</p>
                                            <p className="text-lg text-gray-900">{user.address.city}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start group">
                                        <div className="p-3 rounded-xl bg-rose-50 group-hover:bg-rose-100 transition-colors duration-300">
                                            <LocationOnIcon className="text-rose-500 transform group-hover:scale-110 transition-transform duration-300" />
                                        </div>
                                        <div className="ml-4">
                                            <p className="text-sm font-medium text-gray-500">Province</p>
                                            <p className="text-lg text-gray-900">{user.address.province}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start group">
                                        <div className="p-3 rounded-xl bg-rose-50 group-hover:bg-rose-100 transition-colors duration-300">
                                            <LocationOnIcon className="text-rose-500 transform group-hover:scale-110 transition-transform duration-300" />
                                        </div>
                                        <div className="ml-4">
                                            <p className="text-sm font-medium text-gray-500">Postal Code</p>
                                            <p className="text-lg text-gray-900">{user.address.postalCode}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start group">
                                        <div className="p-3 rounded-xl bg-rose-50 group-hover:bg-rose-100 transition-colors duration-300">
                                            <LocationOnIcon className="text-rose-500 transform group-hover:scale-110 transition-transform duration-300" />
                                        </div>
                                        <div className="ml-4">
                                            <p className="text-sm font-medium text-gray-500">Country</p>
                                            <p className="text-lg text-gray-900">{user.address.country}</p>
                                        </div>
                                    </div>
                        </div>
                    ) : (
                                <p className="text-gray-500 italic text-center py-8">No address information available</p>
                            )}
                        </div>
                    </div>

                    {/* Back Button */}
                    <div className="mt-8">
                        <Button
                            variant="outlined"
                            color="primary"
                            startIcon={<ArrowBackIcon />}
                            onClick={() => navigate(-1)}
                            className="hover:bg-blue-50 transition-all duration-300"
                        >
                          Back
                        </Button>
                    </div>
                </div>
        </div>
    </Layout>
    );
};

export default ProfileView;
