import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateUser, fetchUserById } from "../../redux/action/userAction";
import { TextField, Button, MenuItem } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { getUserIdFromToken } from "../../utilis/token"
import Layout from "../../components/Layout/Layout";


const ProfileEdit = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.users);
  console.log(user)

  const [formData, setFormData] = useState({
    fname: "",
    lname: "",
    dateOfBirth: "",
    email: "",
    phone: "",
    address: {
      street: "",
      city: "",
      province: "",
      postalCode: "",
      country: "",
    },
  });

  useEffect(() => {
    if (user) {
      setFormData({
        fname: user.fname || "",
        lname: user.lname || "",
        dateOfBirth: user.dateOfBirth ? user.dateOfBirth.split("T")[0] : "",
        email: user.email || "",
        phone: user.phone || "",
        address: {
          street: user.address?.street || "",
          city: user.address?.city || "",
          province: user.address?.province || "",
          postalCode: user.address?.postalCode || "",
          country: user.address?.country || "",
        },
      });
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
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  
    // Get the userId from the token
    const userId = getUserIdFromToken();
    console.log(userId)
  
    if (userId) {
      // Dispatch the action with the userId and form data
      dispatch(updateUser(userId, formData));
    } else {
      console.error("User ID missing or invalid token.");
    }
};
  


  return (
    <Layout>
      <div className="p-6 max-w-4xl mx-auto bg-white shadow rounded-lg">
        <h2 className="text-2xl font-semibold mb-4">Edit Profile</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <TextField
            label="First Name"
            name="fname"
            value={formData.fname}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            label="Last Name"
            name="lname"
            value={formData.lname}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            label="Date of Birth"
            name="dateOfBirth"
            type="date"
            value={formData.dateOfBirth}
            onChange={handleChange}
            InputLabelProps={{ shrink: true }}
            fullWidth
          />
          <TextField
            label="Email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            label="Phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            fullWidth
          />


          {/* Address fields */}
          <TextField
            label="Street"
            name="address.street"
            value={formData.address.street}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            label="City"
            name="address.city"
            value={formData.address.city}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            label="Province"
            name="address.province"
            value={formData.address.province}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            label="Postal Code"
            name="address.postalCode"
            value={formData.address.postalCode}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            label="Country"
            name="address.country"
            value={formData.address.country}
            onChange={handleChange}
            fullWidth
          />

      <div className="md:col-span-2 flex justify-between">
        <Button variant="outlined" color="secondary" onClick={() => navigate(-1)}>
          Back
        </Button>
        <Button variant="contained" color="primary" type="submit">
          Save Changes
        </Button>
      </div>

        </form>
      </div>
    </Layout>
  );
};

export default ProfileEdit;
