import React, { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchAllSites,
  createSite,
  updateSite,
  DeleteSite,
} from '../../redux/action/siteAction'
import apiClient from "../../api/apiClient";
import axios from "axios"; // Import Axios
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Chip,
  IconButton,
  Box,
  Button,
  Typography,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { toast } from 'react-hot-toast';
import EditIcon from '@mui/icons-material/Edit';
import ArchiveIcon from '@mui/icons-material/Archive';
import UnarchiveIcon from '@mui/icons-material/Unarchive';
import BlockIcon from '@mui/icons-material/Block';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';


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
  const [statusFilter, setStatusFilter] = useState("");

  // Add new state variables for modals
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  const [showArchiveModal, setShowArchiveModal] = useState(false);
  const [showReactivateModal, setShowReactivateModal] = useState(false);
  const [showInactiveModal, setShowInactiveModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [siteToDelete, setSiteToDelete] = useState(null);
  const [siteToArchive, setSiteToArchive] = useState(null);
  const [siteToReactivate, setSiteToReactivate] = useState(null);
  const [siteToInactive, setSiteToInactive] = useState(null);
  const [archiveReason, setArchiveReason] = useState("");

  // Add confirmDialog state
  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    action: null,
    site: null
  });

  const [siteForm, setSiteForm] = useState({
    name: "",
    location: { address: "", coordinates: [] },
    userId: "", // Manager ID
    isavailable: true,
    description: "",
    status: "active"
  });

  const dispatch = useDispatch(); // Dispatch the action

  const { sites = [], loading, error } = useSelector((state) => {
    console.log('Redux state:', state);
    return state.sites || { sites: [], loading: false, error: null };
  });
  

  useEffect(() => {
    console.log('Fetching sites...');
    dispatch(fetchAllSites());
    fetchManagers();
  }, [dispatch]);

  useEffect(() => {
    console.log('Sites updated:', sites);
  }, [sites]);

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
  const handleDelete = (siteId) => {
    const siteToDelete = sites.find(site => site._id === siteId);
    setSiteToDelete(siteToDelete);
    setShowDeleteConfirmModal(true);
  };

  // Confirm delete
  const confirmDelete = async () => {
    try {
      await dispatch(DeleteSite(siteToDelete._id));
      setShowDeleteConfirmModal(false);
      setSuccessMessage("Site deleted successfully!");
      setShowSuccessModal(true);
      await dispatch(fetchAllSites());
    } catch (error) {
      console.error("Error deleting site:", error);
      setSuccessMessage("Failed to delete site. Please try again.");
      setShowSuccessModal(true);
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
      status: "active"
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
      status: "active"
    });
    onModalClose();
  };

  // Handle archive site
  const handleArchive = (site) => {
    setSiteToArchive(site);
    setShowArchiveModal(true);
    setArchiveReason("");
  };

  // Confirm archive
  const confirmArchive = async () => {
    try {
      const updatedSite = {
        ...siteToArchive,
        status: siteToArchive.status === "active" ? "archived" : "active",
        archiveDate: siteToArchive.status === "active" ? new Date() : null,
        archiveReason: siteToArchive.status === "active" ? archiveReason : null,
        lastActiveDate: siteToArchive.status === "active" ? null : new Date()
      };
      await dispatch(updateSite(siteToArchive._id, updatedSite));
      setShowArchiveModal(false);
      setSuccessMessage(siteToArchive.status === "active" ? "Site archived successfully!" : "Site restored successfully!");
      setShowSuccessModal(true);
      await dispatch(fetchAllSites());
    } catch (error) {
      console.error("Error updating site status:", error);
      setSuccessMessage("Failed to update site status. Please try again.");
      setShowSuccessModal(true);
    }
  };

  // Handle reactivate click
  const handleReactivateClick = (site) => {
    setSiteToReactivate(site);
    setShowReactivateModal(true);
  };

  // Confirm reactivate
  const confirmReactivate = async () => {
    try {
      const updatedSite = {
        ...siteToReactivate,
        status: "active",
        lastActiveDate: new Date(),
        archiveDate: null,
        archiveReason: null
      };
      await dispatch(updateSite(siteToReactivate._id, updatedSite));
      setShowReactivateModal(false);
      setSuccessMessage("Site reactivated successfully!");
      setShowSuccessModal(true);
      await dispatch(fetchAllSites());
    } catch (error) {
      console.error("Error reactivating site:", error);
      setSuccessMessage("Failed to reactivate site. Please try again.");
      setShowSuccessModal(true);
    }
  };

  // Handle inactive click
  const handleInactiveClick = (site) => {
    setSiteToInactive(site);
    setShowInactiveModal(true);
  };

  // Confirm inactive status
  const confirmInactive = async () => {
    try {
      const updatedSite = {
        ...siteToInactive,
        status: "inactive",
        lastActiveDate: new Date(),
        archiveDate: null,
        archiveReason: null
      };
      await dispatch(updateSite(siteToInactive._id, updatedSite));
      setShowInactiveModal(false);
      setSuccessMessage("Site marked as inactive successfully!");
      setShowSuccessModal(true);
      await dispatch(fetchAllSites());
    } catch (error) {
      console.error("Error marking site as inactive:", error);
      setSuccessMessage("Failed to mark site as inactive. Please try again.");
      setShowSuccessModal(true);
    }
  };

  // Update the renderFilters function to be simpler
  const renderFilters = () => (
    <div className="flex space-x-4 mb-4">
      <button
        onClick={() => setStatusFilter("")}
        className={`px-4 py-2 rounded ${
          statusFilter === ""
            ? "bg-blue-500 text-white"
            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
        }`}
      >
        All
      </button>
      <button
        onClick={() => setStatusFilter("active")}
        className={`px-4 py-2 rounded ${
          statusFilter === "active"
            ? "bg-green-500 text-white"
            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
        }`}
      >
        Active
      </button>
      <button
        onClick={() => setStatusFilter("archived")}
        className={`px-4 py-2 rounded ${
          statusFilter === "archived"
            ? "bg-yellow-500 text-white"
            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
        }`}
      >
        Archived
      </button>
      <button
        onClick={() => setStatusFilter("inactive")}
        className={`px-4 py-2 rounded ${
          statusFilter === "inactive"
            ? "bg-red-500 text-white"
            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
        }`}
      >
        Inactive
      </button>
    </div>
  );

  // Update the filtered sites logic to be simpler
  const filteredSites = sites.filter((site) => {
    const matchesSearch = site.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !statusFilter || site.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Update the table row actions to use the new handlers
  const renderSiteActions = (site) => {
    if (site.status === 'active') {
      return (
        <>
          <button
            onClick={() => handleEdit(site)}
            className="text-indigo-600 hover:text-indigo-900 mr-4"
          >
            Edit
          </button>
          <button
            onClick={() => handleArchive(site)}
            className="text-yellow-600 hover:text-yellow-900 mr-4"
          >
            Archive
          </button>
          <button
            onClick={() => handleInactiveClick(site)}
            className="text-orange-600 hover:text-orange-900 mr-4"
          >
            Mark Inactive
          </button>
          <button
            onClick={() => handleDelete(site._id)}
            className="text-red-600 hover:text-red-900"
          >
            Delete
          </button>
        </>
      );
    }

    if (site.status === 'archived') {
      return (
        <button
          onClick={() => handleArchive(site)}
          className="text-indigo-600 hover:text-indigo-900"
        >
          Restore
        </button>
      );
    }

    if (site.status === 'inactive') {
      return (
        <>
          <button
            onClick={() => handleEdit(site)}
            className="text-indigo-600 hover:text-indigo-900 mr-4"
          >
            Edit
          </button>
          <button
            onClick={() => handleArchive(site)}
            className="text-yellow-600 hover:text-yellow-900 mr-4"
          >
            Archive
          </button>
          <button
            onClick={() => handleReactivateClick(site)}
            className="text-green-600 hover:text-green-900"
          >
            Reactivate
          </button>
        </>
      );
    }

    return null;
  };

  // Remove duplicate confirm functions and update the click handlers in the table
  const renderSiteTable = () => (
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
            <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {filteredSites.map((site) => (
            <tr key={site._id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{site.siteId}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">{site.name}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-500">{site.location?.address}</div>
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
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                  ${site.status === 'active' ? 'bg-green-100 text-green-800' : 
                    site.status === 'archived' ? 'bg-gray-100 text-gray-800' : 
                    'bg-red-100 text-red-800'}`}>
                  {site.status || 'active'}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {site.description}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                {renderSiteActions(site)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

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

        {/* Search and Filter Section */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
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
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">All Sites</option>
            <option value="active">Active Sites</option>
            <option value="archived">Archived Sites</option>
            <option value="inactive">Inactive Sites</option>
          </select>
        </div>

        {/* Sites Table */}
        {renderSiteTable()}

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

        {/* Archive Modal */}
        {showArchiveModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white rounded-lg shadow-xl p-6 max-w-sm w-full mx-4">
              <div className="text-center">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-yellow-100 mb-4">
                  <svg className="h-6 w-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {siteToArchive?.status === "active" ? "Archive Site" : "Restore Site"}
                </h3>
                <p className="text-sm text-gray-500 mb-4">
                  Are you sure you want to {siteToArchive?.status === "active" ? "archive" : "restore"} {siteToArchive?.name}?
                </p>
                {siteToArchive?.status === "active" && (
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Archive Reason</label>
                    <textarea
                      value={archiveReason}
                      onChange={(e) => setArchiveReason(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                      rows="3"
                      placeholder="Enter reason for archiving..."
                      required
                    />
                  </div>
                )}
                <div className="flex justify-center space-x-4">
                  <button
                    onClick={() => setShowArchiveModal(false)}
                    className="inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:text-sm"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmArchive}
                    className="inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-yellow-500 text-base font-medium text-white hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 sm:text-sm"
                  >
                    {siteToArchive?.status === "active" ? "Archive" : "Restore"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Reactivate Confirmation Modal */}
        {showReactivateModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white rounded-lg shadow-xl p-6 max-w-sm w-full mx-4">
              <div className="text-center">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                  <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Reactivate Site</h3>
                <p className="text-sm text-gray-500 mb-4">
                  Are you sure you want to reactivate {siteToReactivate?.name}?
                </p>
                <div className="flex justify-center space-x-4">
                  <button
                    onClick={() => setShowReactivateModal(false)}
                    className="inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:text-sm"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmReactivate}
                    className="inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-500 text-base font-medium text-white hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:text-sm"
                  >
                    Reactivate
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Mark Inactive Confirmation Modal */}
        {showInactiveModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white rounded-lg shadow-xl p-6 max-w-sm w-full mx-4">
              <div className="text-center">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-orange-100 mb-4">
                  <svg className="h-6 w-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Mark Site as Inactive</h3>
                <p className="text-sm text-gray-500 mb-4">
                  Are you sure you want to mark {siteToInactive?.name} as inactive?
                </p>
                <div className="flex justify-center space-x-4">
                  <button
                    onClick={() => setShowInactiveModal(false)}
                    className="inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:text-sm"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmInactive}
                    className="inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-orange-500 text-base font-medium text-white hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 sm:text-sm"
                  >
                    Mark Inactive
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteConfirmModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white rounded-lg shadow-xl p-6 max-w-sm w-full mx-4">
              <div className="text-center">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                  <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Delete Site</h3>
                <p className="text-sm text-gray-500 mb-4">
                  Are you sure you want to delete {siteToDelete?.name}? This action cannot be undone.
                </p>
                <div className="flex justify-center space-x-4">
                  <button
                    onClick={() => setShowDeleteConfirmModal(false)}
                    className="inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:text-sm"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmDelete}
                    className="inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-500 text-base font-medium text-white hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Success Modal */}
        {showSuccessModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white rounded-lg shadow-xl p-6 max-w-sm w-full mx-4">
              <div className="text-center">
                <div className={`mx-auto flex items-center justify-center h-12 w-12 rounded-full ${successMessage.includes("success") ? "bg-green-100" : "bg-yellow-100"} mb-4`}>
                  {successMessage.includes("success") ? (
                    <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <svg className="h-6 w-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  )}
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">{successMessage}</h3>
                <button
                  onClick={() => setShowSuccessModal(false)}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-500 text-base font-medium text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:text-sm"
                >
                  OK
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SiteManagement;
