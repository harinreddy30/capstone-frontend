import React, { useState, useEffect } from "react";
import axios from "axios";

const SiteManagement = () => {
  const [sites, setSites] = useState([]);
  const [managers, setManagers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedSite, setSelectedSite] = useState(null);

  const [siteForm, setSiteForm] = useState({
    name: "",
    location: { address: "", coordinates: [] },
    userId: "", // Manager ID
    isavailable: true,
    description: "",
  });

  useEffect(() => {
    fetchSites();
    fetchManagers();
  }, []);

  const fetchSites = async () => {
    try {
      const res = await axios.get("/api/sites");
      setSites(res.data);
    } catch (error) {
      console.error("Error fetching sites:", error);
    }
  };

  const fetchManagers = async () => {
    try {
      const res = await axios.get("/api/users"); // Fetch all users
      const managerList = res.data.filter((user) => user.role === "Manager"); // Only Managers
      setManagers(managerList);
    } catch (error) {
      console.error("Error fetching managers:", error);
    }
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setSiteForm({ ...siteForm, [name]: value });
  };

  const handleLocationChange = (event) => {
    const { name, value } = event.target;
    setSiteForm({ ...siteForm, location: { ...siteForm.location, [name]: value } });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      if (editMode) {
        await axios.put(`/api/sites/${selectedSite.siteId}`, siteForm);
      } else {
        await axios.post("/api/sites", siteForm);
      }
      setShowModal(false);
      setEditMode(false);
      fetchSites();
    } catch (error) {
      console.error("Error submitting site data:", error);
    }
  };

  const handleEdit = (site) => {
    setSelectedSite(site);
    setSiteForm(site);
    setEditMode(true);
    setShowModal(true);
  };

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
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {sites
            .filter((site) =>
              site.name.toLowerCase().includes(searchTerm.toLowerCase())
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
                  <button
                    onClick={() => handleEdit(site)}
                    className="bg-yellow-500 text-white px-3 py-1 rounded mr-2"
                  >
                    Edit
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

              {/* Manager Selection */}
              <select
                name="userId"
                value={siteForm.userId}
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
