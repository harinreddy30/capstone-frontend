import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchAllSites,
  createSite,
  updateSite,
  DeleteSite,
} from '../../redux/action/siteAction'
import apiClient from "../../api/apiClient";
import axios from "axios"; // Import Axios


const countries = {
  "Canada": ["Ontario", "Quebec", "British Columbia", "Alberta"],
  "USA": ["California", "Texas", "Florida", "New York"],
  "India": ["Gujarat", "Maharashtra", "Punjab", "Rajasthan"]
};

const SiteManagement = ( ) => {

  // const [sites, setSites] = useState([]);
  const [managers, setManagers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedSite, setSelectedSite] = useState(null);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedProvince, setSelectedProvince] = useState("");

  const [siteForm, setSiteForm] = useState({
    name: "",
    location: { address: "", coordinates: [] },
    userId: "", // Manager ID
    isavailable: true,
    description: "",
  });

  const dispatch = useDispatch(); // Dispatch the action

  // Fetch Users from Redux store
  const { sites, loading, error } = useSelector((state) => state.sites);
  

  useEffect(() => {
    dispatch(fetchAllSites());
    fetchManagers();
  }, [dispatch]);

  const fetchManagers = async () => {
    try {
      const res = await apiClient.get("/api/v1/users"); // Fetch all users
      const managerList = res.data.filter((user) => user.role === "Manager"); // Only Managers
      setManagers(managerList);
    } catch (error) {
      console.error("Error fetching managers:", error);
    }
  };

  // Fetch coordinates based on address
  const fetchCoordinates = async (address) => {
    try {
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/search`,
        {
          params: {
            q: address,
            format: "json",
          },
        }
      );

      if (response.data.length > 0) {
        const { lat, lon } = response.data[0];
        setSiteForm((prev) => ({
          ...prev,
          location: {
            ...prev.location,
            coordinates: [parseFloat(lat), parseFloat(lon)], // Save as [latitude, longitude]
          },
        }));
      } else {
        console.error("No coordinates found for the address.");
      }
    } catch (error) {
      console.error("Error fetching coordinates:", error);
    }
  };

  // Handle address input change and auto-fetch coordinates
  const handleLocationChange = (event) => {
    const { value } = event.target;
    setSiteForm((prev) => ({
      ...prev,
      location: { ...prev.location, address: value },
    }));

    if (value.length > 3) {
      fetchCoordinates(value); // Auto-fetch when user types
    }
  };

  const handleCountryChange = (event) => {
    setSelectedCountry(event.target.value);
    setSelectedProvince("");
  };

  const handleProvinceChange = (event) => {
    setSelectedProvince(event.target.value);
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setSiteForm({ ...siteForm, [name]: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {

      if (!siteForm.location.coordinates.length) {
        alert("Invalid address! Please enter a valid address.");
        return;
      }
      
      if (editMode) {
        dispatch(updateSite(selectedSite._id, siteForm))
      } else {
        dispatch(createSite(siteForm));
      }

      setShowModal(false);
      setEditMode(false);
      await dispatch(fetchAllSites());

    } catch (error) {
      console.error("Error submitting site data:", error);
    }
  };

  // Handle the edit
  const handleEdit = (site) => {
    setSelectedSite(site);
    setSiteForm(site);
    setEditMode(true);
    setShowModal(true);
  };

  // Handle Delete User
  const handleDelete = (siteId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this Site?");
    if (confirmDelete) {
      dispatch(DeleteSite(siteId)); // Dispatch delete action
      dispatch(fetchAllSites()); // Refresh user list after deletion
    }
  };
  if (loading) return <div>Loading managers...</div>;
  if (error) return <div>{JSON.stringify(error)}</div>;
  

  return (
    <div className="p-6">
      <div className="flex justify-between mb-4">
        <input
          type="text"
          placeholder="Search sites..."
          value={searchTerm}
          onChange={handleSearch}
          className="border p-2 rounded w-1/3"
        />
        <button
          onClick={() => {
            setShowModal(true);
            setEditMode(false);
            setSiteForm({
              name: "",
              location: { address: "", coordinates: [] },
              userId: "",
              isavailable: true,
              description: "",
            });
          }}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Add Site
        </button>
      </div>

      {/* Site Table */}
      <table className="w-full border-collapse border">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">Site ID</th>
            <th className="border p-2">Name</th>
            <th className="border p-2">Location</th>
            <th className="border p-2">Manager</th>
            <th className="border p-2">Available</th>
            <th className="border p-2">Description</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {sites
            .filter((site) =>
              site?.name?.toLowerCase().includes(searchTerm.toLowerCase())
          )
            .map((site) => (
              <tr key={site.siteId} className="text-center">
                <td className="border p-2">{site.siteId}</td>
                <td className="border p-2">{site.name}</td>
                <td className="border p-2">{site.location.address}</td>
                <td className="border p-2">
                  {site.userId ? site.userId.fname + " " + site.userId.lname : "Not Assigned"}
                </td>
                <td className="border p-2">
                  {site.isavailable ? "Yes" : "No"}
                </td>
                <td className="border p-2">
                  {site.description}
                </td>
                <td className="border p-2">
                  <button
                    onClick={() => handleEdit(site)}
                    className="bg-yellow-500 text-white px-3 py-1 rounded mr-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(site._id)}
                    className="bg-red-500 text-white px-3 py-1 rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>

      {/* Add/Edit Site Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
            <h2 className="text-lg font-bold mb-4">
              {editMode ? "Edit Site" : "Add New Site"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                name="name"
                value={siteForm.name}
                onChange={handleInputChange}
                placeholder="Site Name"
                className="border p-2 w-full"
                required
              />

              <input
                type="text"
                name="address"
                value={siteForm.location.address}
                onChange={handleLocationChange}
                placeholder="Address"
                className="border p-2 w-full"
                required
              />

              <input
                type="text"
                name="coordinates"
                value={siteForm.location.coordinates.join(", ")}
                onChange={(e) =>
                  setSiteForm({
                    ...siteForm,
                    location: {
                      ...siteForm.location,
                      coordinates: e.target.value.split(",").map(Number),
                    },
                  })
                }
                placeholder="Coordinates (Lat, Lng)"
                className="border p-2 w-full"
                required
              />

              <select
                value={selectedCountry}
                onChange={handleCountryChange}
                className="border p-2 w-full"
              >
                <option value="">Select Country</option>
                {Object.keys(countries).map((country) => (
                  <option key={country} value={country}>{country}</option>
                ))}
              </select>

              <select
                value={selectedProvince}
                onChange={handleProvinceChange}
                className="border p-2 w-full"
                disabled={!selectedCountry}
              >
                <option value="">Select Province/State</option>
                {selectedCountry && countries[selectedCountry].map((province) => (
                  <option key={province} value={province}>{province}</option>
                ))}
              </select>

              {/* Manager Selection */}
              <select
                name="userId"
                value={siteForm.userId || ""}
                onChange={handleInputChange}
                className="border p-2 w-full"
                required
              >
                <option value="">Select Manager</option>
                {managers.map((manager) => (
                  <option key={manager._id} value={manager._id}>
                    {manager.fname} {manager.lname}
                  </option>
                ))}
              </select>

              <textarea
                name="description"
                value={siteForm.description}
                onChange={handleInputChange}
                placeholder="Description"
                className="border p-2 w-full"
              ></textarea>

              <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">
                {editMode ? "Update" : "Add"}
              </button>
              <button onClick={() => setShowModal(false)} className="ml-2 bg-gray-500 text-white px-4 py-2 rounded">
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SiteManagement;
