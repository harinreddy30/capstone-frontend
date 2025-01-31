import React, { useState, useEffect } from "react";
import apiClient from "../../api/apiClient";


const ManagerSites = ({ managerId }) => {
  const [sites, setSites] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showShiftModal, setShowShiftModal] = useState(false);
  const [selectedSite, setSelectedSite] = useState(null);
  const [shiftForm, setShiftForm] = useState({
    shiftName: "",
    startTime: "",
    endTime: "",
    hours: 0,
    jobDescription: "",
    applyToDays: [],
    siteId: "",
  });

  useEffect(() => {
    fetchManagerSites();
  }, []);

  const fetchManagerSites = async () => {
    try {
      const res = await apiClient.get(`/api/manager/sites/${managerId}`);
      console.log(managerId);
      console.log(res);

      setSites(res.data);
    } catch (error) {
      console.error("Error fetching sites:", error);
    }
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleShiftInputChange = (event) => {
    const { name, value } = event.target;
    setShiftForm({ ...shiftForm, [name]: value });

    if (name === "startTime" || name === "endTime") {
      calculateHours(name, value);
    }
  };

  const calculateHours = (name, value) => {
    let startTime = shiftForm.startTime;
    let endTime = shiftForm.endTime;

    if (name === "startTime") startTime = value;
    if (name === "endTime") endTime = value;

    if (startTime && endTime) {
      const start = new Date(`2023-01-01T${startTime}`);
      const end = new Date(`2023-01-01T${endTime}`);
      const diff = (end - start) / (1000 * 60 * 60);
      setShiftForm((prev) => ({ ...prev, hours: diff > 0 ? diff : 0 }));
    }
  };

  const handleDaySelection = (day) => {
    setShiftForm((prev) => ({
      ...prev,
      applyToDays: prev.applyToDays.includes(day)
        ? prev.applyToDays.filter((d) => d !== day)
        : [...prev.applyToDays, day],
    }));
  };

  const handleAddShift = async (event) => {
    event.preventDefault();
    try {
      await apiClient.post("/api/shifts", shiftForm);
      setShowShiftModal(false);
    } catch (error) {
      console.error("Error adding shift:", error);
    }
  };

  const openShiftModal = (site) => {
    setSelectedSite(site);
    setShiftForm({
      shiftName: "",
      startTime: "",
      endTime: "",
      hours: 0,
      jobDescription: "",
      applyToDays: [],
      siteId: site.siteId,
    });
    setShowShiftModal(true);
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
      </div>

      {/* Sites Table */}
      <table className="w-full border-collapse border">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">Site ID</th>
            <th className="border p-2">Name</th>
            <th className="border p-2">Location</th>
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
                  <button
                    onClick={() => openShiftModal(site)}
                    className="bg-blue-500 text-white px-3 py-1 rounded"
                  >
                    Add Shift
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>

      {/* Add Shift Modal */}
      {showShiftModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-lg w-1/3">
            <h2 className="text-xl font-bold mb-4">
              Add Shift for {selectedSite.name}
            </h2>
            <form onSubmit={handleAddShift}>
              <div className="mb-3">
                <label className="block text-sm font-medium">Shift Name</label>
                <input
                  type="text"
                  name="shiftName"
                  value={shiftForm.shiftName}
                  onChange={handleShiftInputChange}
                  className="border p-2 w-full rounded"
                  required
                />
              </div>

              <div className="mb-3">
                <label className="block text-sm font-medium">Start Time</label>
                <input
                  type="time"
                  name="startTime"
                  value={shiftForm.startTime}
                  onChange={handleShiftInputChange}
                  className="border p-2 w-full rounded"
                  required
                />
              </div>

              <div className="mb-3">
                <label className="block text-sm font-medium">End Time</label>
                <input
                  type="time"
                  name="endTime"
                  value={shiftForm.endTime}
                  onChange={handleShiftInputChange}
                  className="border p-2 w-full rounded"
                  required
                />
              </div>

              <div className="mb-3">
                <label className="block text-sm font-medium">Hours</label>
                <input
                  type="text"
                  value={shiftForm.hours}
                  readOnly
                  className="border p-2 w-full rounded bg-gray-100"
                />
              </div>

              <div className="mb-3">
                <label className="block text-sm font-medium">
                  Job Description
                </label>
                <textarea
                  name="jobDescription"
                  value={shiftForm.jobDescription}
                  onChange={handleShiftInputChange}
                  className="border p-2 w-full rounded"
                ></textarea>
              </div>

              <div className="mb-3">
                <label className="block text-sm font-medium">
                  Apply to Days:
                </label>
                <div className="grid grid-cols-7 gap-2 mt-2">
                  {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(
                    (day) => (
                      <label key={day} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={shiftForm.applyToDays.includes(day)}
                          onChange={() => handleDaySelection(day)}
                        />
                        <span>{day}</span>
                      </label>
                    )
                  )}
                </div>
              </div>

              <div className="flex justify-between">
                <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">
                  Save Shift
                </button>
                <button
                  onClick={() => setShowShiftModal(false)}
                  className="bg-gray-500 text-white px-4 py-2 rounded"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManagerSites;
