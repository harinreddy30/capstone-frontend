import React, { useState, useEffect } from 'react';

const PayrollViewer = () => {
  const [payrolls, setPayrolls] = useState([]);
  const [filteredPayrolls, setFilteredPayrolls] = useState([]);
  const [selectedPeriod, setSelectedPeriod] = useState({ start: '', end: '' });
  const [currentPayroll, setCurrentPayroll] = useState(null);

  useEffect(() => {
    const fetchPayrolls = async () => {
      try {
        const response = await fetch('/api/payrolls', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setPayrolls(data.payrolls);
        } else {
          console.error('Failed to fetch payroll data');
        }
      } catch (error) {
        console.error('Error fetching payroll data:', error);
      }
    };

    fetchPayrolls();
  }, []);

  const handlePeriodChange = (e) => {
    const { name, value } = e.target;
    setSelectedPeriod({ ...selectedPeriod, [name]: value });
  };

  const handleFilter = () => {
    if (!selectedPeriod.start || !selectedPeriod.end) {
      alert('Please select a valid date range.');
      return;
    }

    const startDate = new Date(selectedPeriod.start);
    const endDate = new Date(selectedPeriod.end);

    const filtered = payrolls.filter((payroll) => {
      const payrollStartDate = new Date(payroll.payPeriod.start);
      const payrollEndDate = new Date(payroll.payPeriod.end);

      return payrollStartDate >= startDate && payrollEndDate <= endDate;
    });

    setFilteredPayrolls(filtered);
  };

  const handleViewPayroll = (payrollId) => {
    const payroll = payrolls.find((p) => p._id === payrollId);
    setCurrentPayroll(payroll);
  };

  const handleDownload = () => {
    if (!currentPayroll) return;

    const blob = new Blob([JSON.stringify(currentPayroll, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `payroll_${currentPayroll.payPeriod.start}_to_${currentPayroll.payPeriod.end}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-50 rounded-lg shadow-lg text-gray-800">
      <h2 className="text-2xl font-bold text-center mb-6">Payroll Viewer</h2>

      <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4 mb-6">
        <label className="font-semibold text-gray-700">From:</label>
        <input
          type="date"
          name="start"
          value={selectedPeriod.start}
          onChange={handlePeriodChange}
          className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
        <label className="font-semibold text-gray-700">To:</label>
        <input
          type="date"
          name="end"
          value={selectedPeriod.end}
          onChange={handlePeriodChange}
          className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
        <button
          onClick={handleFilter}
          className="px-6 py-2 mt-4 sm:mt-0 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Filter
        </button>
      </div>

      <div>
        <h3 className="text-xl font-bold mb-4">Past Payrolls</h3>
        {filteredPayrolls.length === 0 ? (
          <p className="text-gray-500">No payrolls found for the selected period.</p>
        ) : (
          <ul className="space-y-4">
            {filteredPayrolls.map((payroll) => (
              <li
                key={payroll._id}
                className="p-4 bg-white border border-gray-300 rounded-lg shadow-sm flex justify-between items-center hover:bg-gray-100"
              >
                <span className="text-gray-700 font-medium">
                  {new Date(payroll.payPeriod.start).toLocaleDateString()} -{' '}
                  {new Date(payroll.payPeriod.end).toLocaleDateString()}
                </span>
                <button
                  onClick={() => handleViewPayroll(payroll._id)}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none"
                >
                  View
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {currentPayroll && (
        <div className="mt-8 p-6 bg-gray-100 rounded-lg shadow-md">
          <h3 className="text-xl font-bold mb-4">Payroll Details</h3>
          <p>
            <strong>Pay Period:</strong>{' '}
            {new Date(currentPayroll.payPeriod.start).toLocaleDateString()} -{' '}
            {new Date(currentPayroll.payPeriod.end).toLocaleDateString()}
          </p>
          <p>
            <strong>Gross Pay:</strong> ${currentPayroll.grossPay.toFixed(2)}
          </p>
          <p>
            <strong>Net Pay:</strong> ${currentPayroll.netPay.toFixed(2)}
          </p>
          <p>
            <strong>Status:</strong> {currentPayroll.status}
          </p>
          <p>
            <strong>Deductions:</strong>
          </p>
          <ul className="list-disc list-inside ml-4">
            <li>Taxes: ${currentPayroll.deductions.taxes.toFixed(2)}</li>
            <li>CPP: ${currentPayroll.deductions.CPP.toFixed(2)}</li>
            <li>EI: ${currentPayroll.deductions.EI.toFixed(2)}</li>
            <li>Other: ${currentPayroll.deductions.otherDeductions.toFixed(2)}</li>
          </ul>
          <button
            onClick={handleDownload}
            className="mt-4 px-6 py-2 bg-yellow-500 text-gray-800 rounded-md hover:bg-yellow-600 focus:outline-none"
          >
            Download
          </button>
        </div>
      )}
    </div>
  );
};

export default PayrollViewer;
