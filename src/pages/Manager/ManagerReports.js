import React, { useState, useEffect } from "react";
import axios from "axios";

const ManagerReports = () => {
  const [reports, setReports] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedReport, setSelectedReport] = useState(null);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const response = await axios.get("/api/reports"); // Replace with actual API
      setReports(response.data);
    } catch (error) {
      console.error("Error fetching reports:", error);
    }
  };

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  const filteredReports = reports.filter((report) =>
    report.reportName.toLowerCase().includes(search.toLowerCase()) ||
    report.createdBy.name.toLowerCase().includes(search.toLowerCase()) ||
    report.status.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6">
      {/* Search Bar */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Incident Reports</h2>
        <input
          type="text"
          placeholder="Search by site, user, date, or status..."
          value={search}
          onChange={handleSearch}
          className="border p-2 rounded w-1/3"
        />
      </div>

      {/* Reports Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2">Report ID</th>
              <th className="border p-2">Report Name</th>
              <th className="border p-2">Created By</th>
              <th className="border p-2">Incident Date</th>
              <th className="border p-2">Status</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredReports.map((report) => (
              <tr key={report.reportId} className="text-center">
                <td className="border p-2">{report.reportId}</td>
                <td className="border p-2">{report.reportName}</td>
                <td className="border p-2">{report.createdBy.name}</td>
                <td className="border p-2">{new Date(report.incidentDate).toLocaleDateString()}</td>
                <td className="border p-2">{report.status}</td>
                <td className="border p-2">
                  <button
                    className="bg-blue-500 text-white px-3 py-1 rounded"
                    onClick={() => setSelectedReport(report)}
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Report Detail Modal */}
      {selectedReport && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-lg w-1/2">
            <h3 className="text-xl font-semibold">{selectedReport.reportName}</h3>
            <p><strong>Description:</strong> {selectedReport.reportDescription}</p>
            <p><strong>Incident Date:</strong> {new Date(selectedReport.incidentDate).toLocaleString()}</p>
            <p><strong>Status:</strong> {selectedReport.status}</p>
            <p><strong>Created By:</strong> {selectedReport.createdBy.name}</p>
            <div className="flex justify-end mt-4">
              <button
                className="bg-red-500 text-white px-4 py-2 rounded"
                onClick={() => setSelectedReport(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManagerReports;
