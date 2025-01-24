import React from 'react';

const IncidentReport = () => {
  return (
    <div className="max-w-[600px] mx-auto p-5 bg-gray-100 rounded-lg shadow-md">
      <form className="flex flex-col">
        {/* Date/Time of Incident */}
        <div className="mb-4">
          <label className="font-bold mb-2 block" htmlFor="incidentDateTime">
            Date/Time of Incident
          </label>
          <input
            type="datetime-local"
            id="incidentDateTime"
            className="w-full p-3 border border-gray-300 rounded"
          />
        </div>

        {/* Location */}
        <div className="mb-4">
          <label className="font-bold mb-2 block" htmlFor="incidentLocation">
            Location
          </label>
          <input
            type="text"
            id="incidentLocation"
            className="w-full p-3 border border-gray-300 rounded"
            placeholder="Enter location"
          />
        </div>

        {/* Reported By */}
        <div className="mb-4">
          <label className="font-bold mb-2 block" htmlFor="reportedBy">
            Reported By
          </label>
          <input
            type="text"
            id="reportedBy"
            className="w-full p-3 border border-gray-300 rounded bg-gray-200 cursor-not-allowed"
            value="John Doe (Autofilled)" // Example value from backend token
            disabled
          />
        </div>

        {/* Employee Involved */}
        <div className="mb-4">
          <label className="font-bold mb-2 block" htmlFor="employeeInvolved">
            Employee Involved
          </label>
          <input
            type="text"
            id="employeeInvolved"
            className="w-full p-3 border border-gray-300 rounded"
            placeholder="Enter employee's name"
          />
        </div>

        {/* Position */}
        <div className="mb-4">
          <label className="font-bold mb-2 block" htmlFor="position">
            Position
          </label>
          <input
            type="text"
            id="position"
            className="w-full p-3 border border-gray-300 rounded"
            placeholder="Enter position"
          />
        </div>

        {/* Incident Type */}
        <div className="mb-4">
          <label className="font-bold mb-2 block" htmlFor="incidentType">
            Incident Type
          </label>
          <select
            id="incidentType"
            className="w-full p-3 border border-gray-300 rounded"
          >
            <option value="">Select incident type</option>
            <option value="safety">Safety</option>
            <option value="harassment">Harassment</option>
            <option value="propertyDamage">Property Damage</option>
            <option value="injury">Injury</option>
            <option value="other">Other</option>
          </select>
        </div>

        {/* Description of Incident */}
        <div className="mb-4">
          <label className="font-bold mb-2 block" htmlFor="incidentDescription">
            Description of Incident
          </label>
          <textarea
            id="incidentDescription"
            className="w-full p-3 border border-gray-300 rounded resize-y"
            rows="5"
            placeholder="Describe the incident"
          ></textarea>
        </div>

        {/* Witnesses */}
        <div className="mb-4">
          <label className="font-bold mb-2 block" htmlFor="witnesses">
            Witnesses
          </label>
          <textarea
            id="witnesses"
            className="w-full p-3 border border-gray-300 rounded resize-y"
            rows="3"
            placeholder="Enter witnesses (if any)"
          ></textarea>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-blue-500 text-white font-bold text-lg py-2 rounded hover:bg-blue-600"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default IncidentReport;
