import React, { useState, useEffect } from 'react';
import './PayStub.css'; // Create CSS for styling

const PayrollViewer = () => {
  const [payrolls, setPayrolls] = useState([]);
  const [filteredPayrolls, setFilteredPayrolls] = useState([]);
  const [selectedPeriod, setSelectedPeriod] = useState({ start: '', end: '' });
  const [currentPayroll, setCurrentPayroll] = useState(null);

  useEffect(() => {
    // Fetch all payroll data from the backend
    const fetchPayrolls = async () => {
      try {
        const response = await fetch('/api/payrolls', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
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
    <div className="payroll-viewer">
      <h2>Payroll Viewer</h2>

      <div className="filter-section">
        <label>From:</label>
        <input
          type="date"
          name="start"
          value={selectedPeriod.start}
          onChange={handlePeriodChange}
        />
        <label>To:</label>
        <input
          type="date"
          name="end"
          value={selectedPeriod.end}
          onChange={handlePeriodChange}
        />
        <button onClick={handleFilter}>Filter</button>
      </div>

      <div className="payroll-list">
        <h3>Past Payrolls</h3>
        {filteredPayrolls.length === 0 ? (
          <p>No payrolls found for the selected period.</p>
        ) : (
          <ul>
            {filteredPayrolls.map((payroll) => (
              <li key={payroll._id}>
                <span>
                  {new Date(payroll.payPeriod.start).toLocaleDateString()} -{' '}
                  {new Date(payroll.payPeriod.end).toLocaleDateString()}
                </span>
                <button onClick={() => handleViewPayroll(payroll._id)}>View</button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {currentPayroll && (
        <div className="current-payroll">
          <h3>Payroll Details</h3>
          <p><strong>Pay Period:</strong> {new Date(currentPayroll.payPeriod.start).toLocaleDateString()} - {new Date(currentPayroll.payPeriod.end).toLocaleDateString()}</p>
          <p><strong>Gross Pay:</strong> ${currentPayroll.grossPay.toFixed(2)}</p>
          <p><strong>Net Pay:</strong> ${currentPayroll.netPay.toFixed(2)}</p>
          <p><strong>Status:</strong> {currentPayroll.status}</p>
          <p><strong>Deductions:</strong></p>
          <ul>
            <li>Taxes: ${currentPayroll.deductions.taxes.toFixed(2)}</li>
            <li>CPP: ${currentPayroll.deductions.CPP.toFixed(2)}</li>
            <li>EI: ${currentPayroll.deductions.EI.toFixed(2)}</li>
            <li>Other: ${currentPayroll.deductions.otherDeductions.toFixed(2)}</li>
          </ul>
          <button onClick={handleDownload}>Download</button>
        </div>
      )}
    </div>
  );
};

export default PayrollViewer;
