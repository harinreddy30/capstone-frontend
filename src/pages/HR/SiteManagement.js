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

const SiteManagement = ({ onModalOpen, onModalClose }) => {

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

  const { sites = [], loading, error } = useSelector((state) => state.sites || { sites: [], loading: false, error: null });
  

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
        await dispatch(updateSite(selectedSite._id, siteForm))
      } else {
        await dispatch(createSite(siteForm));
      }

      closeModal();
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
    onModalOpen();
  };

  // Handle Delete User
  const handleDelete = async (siteId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this Site?");
    if (confirmDelete) {
      await dispatch(DeleteSite(siteId)); // Dispatch delete action
      dispatch(fetchAllSites()); // Refresh user list after deletion
    }
  };

  // Add new handleAddClick function
  const handleAddClick = () => {
    setShowModal(true);
    setEditMode(false);
    setSiteForm({
      name: "",
      location: { address: "", coordinates: [] },
      userId: "",
      isavailable: true,
      description: "",
    });
    onModalOpen();
  };

  // Add closeModal function
  const closeModal = () => {
    setShowModal(false);
    setEditMode(false);
    setSiteForm({
      name: "",
      location: { address: "", coordinates: [] },
      userId: "",
      isavailable: true,
      description: "",
    });
    onModalClose();
  };

  if (loading) return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
    </div>
  );

  if (error) return (
    <div className="text-center text-red-600 p-4">
      <p>Error loading sites: {error.message || 'Something went wrong'}</p>
    </div>
  );

  if (!Array.isArray(sites)) return (
    <div className="text-center text-yellow-600 p-4">
      <p>No sites data available</p>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-lg shadow-lg p-6">
        {/* Header Section */}
        <div className="sm:flex sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Site Management</h1>
            <p className="mt-2 text-sm text-gray-600">Manage your organization's locations and facilities</p>
          </div>
          <button
            onClick={handleAddClick}
            className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Add Site
          </button>
        </div>

        {/* Search Section */}
        <div className="mb-6">
          <div className="relative">
            <input
              type="text"
              placeholder="Search sites by name or location..."
              value={searchTerm}
              onChange={handleSearch}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Sites Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Site ID</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Manager</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {(sites || [])
                .filter((site) =>
                  site && site.name && site.name.toLowerCase().includes(searchTerm.toLowerCase())
                )
                .map((site) => (
                  <tr key={site.siteId} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{site.siteId}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{site.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{site.location.address}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {site.userId ? (
                          <>
                            <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                              <span className="text-sm font-medium text-green-800">
                                {site.userId.fname[0]}{site.userId.lname[0]}
                              </span>
                            </div>
                            <div className="ml-4 text-sm text-gray-900">
                              {site.userId.fname} {site.userId.lname}
                            </div>
                          </>
                        ) : (
                          <span className="text-sm text-gray-500">Not Assigned</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        site.isavailable
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {site.isavailable ? 'Available' : 'Unavailable'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {site.description}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleEdit(site)}
                        className="text-indigo-600 hover:text-indigo-900 mr-4"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(site._id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Site Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="absolute inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>
          <div className="relative bg-white rounded-lg max-w-xl w-full mx-4 shadow-xl">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900">
                  {editMode ? "Edit Site" : "Add New Site"}
                </h3>
                <button
                  onClick={closeModal}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="px-6 py-4">
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Site Name</label>
                  <input
                    type="text"
                    name="name"
                    value={siteForm.name}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                  <input
                    type="text"
                    name="address"
                    value={siteForm.location.address}
                    onChange={handleLocationChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Coordinates</label>
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                    <select
                      value={selectedCountry}
                      onChange={handleCountryChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                    >
                      <option value="">Select Country</option>
                      {Object.keys(countries).map((country) => (
                        <option key={country} value={country}>{country}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Province/State</label>
                    <select
                      value={selectedProvince}
                      onChange={handleProvinceChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                      disabled={!selectedCountry}
                    >
                      <option value="">Select Province/State</option>
                      {selectedCountry && countries[selectedCountry].map((province) => (
                        <option key={province} value={province}>{province}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Manager</label>
                  <select
                    name="userId"
                    value={siteForm.userId || ""}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                    required
                  >
                    <option value="">Select Manager</option>
                    {managers.map((manager) => (
                      <option key={manager._id} value={manager._id}>
                        {manager.fname} {manager.lname}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    name="description"
                    value={siteForm.description}
                    onChange={handleInputChange}
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                  ></textarea>
                </div>
              </div>

              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  {editMode ? "Update" : "Add"} Site
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SiteManagement;
