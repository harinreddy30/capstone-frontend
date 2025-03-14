import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserById } from '../../redux/action/userAction';
import { useNavigate } from 'react-router-dom';
import { getUserIdFromToken } from "../../utilis/token"
import { Button } from "@mui/material";

import Layout from "../../components/Layout/Layout";


const ProfileView = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { user, loading, error } = useSelector((state) => state.users);

    const userId = getUserIdFromToken();
    
    useEffect(() => {
        if (userId) {
            dispatch(fetchUserById(userId));
        }
    }, [dispatch, userId]);

    const handleEdit = () => {
        navigate('/profile/edit');
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p className="text-red-500">Error: {error?.message || error}</p>;

    return (
        <Layout>
        <div className="profile-view p-4 max-w-xl mx-auto bg-white rounded shadow-md">
            <h2 className="text-xl font-bold mb-4">User Profile</h2>

            {user ? (
                <div className="space-y-2">
                    <p><strong>First Name:</strong> {user.fname}</p>
                    <p><strong>Last Name:</strong> {user.lname}</p>
                    <p><strong>Email:</strong> {user.email}</p>
                    <p><strong>Phone:</strong> {user.phone}</p>
                    <p><strong>Date of Birth:</strong> {new Date(user.dateOfBirth).toLocaleDateString()}</p>

                    <h3 className="mt-4 font-semibold">Address</h3>
                    {user.address ? (
                        <div className="pl-4">
                            <p><strong>Street:</strong> {user.address.street}</p>
                            <p><strong>City:</strong> {user.address.city}</p>
                            <p><strong>Province:</strong> {user.address.province}</p>
                            <p><strong>Postal Code:</strong> {user.address.postalCode}</p>
                            <p><strong>Country:</strong> {user.address.country}</p>
                        </div>
                    ) : (
                        <p>No address info</p>
                    )}

                    <p><strong>Hourly Wage:</strong> {user.hourlyWage}</p>
                    <p><strong>Role:</strong> {user.role}</p>



                    <div className="md:col-span-2 flex justify-between">
                        <Button variant="outlined" color="secondary" onClick={() => navigate(-1)}>
                          Back
                        </Button>
                        <Button variant="contained" color="primary" onClick={handleEdit}>
                            Edit Profile
                        </Button>
                    </div>
                </div>
            ) : (
                <p>User data not available</p>
            )}
        </div>
    </Layout>
    );
};

export default ProfileView;
