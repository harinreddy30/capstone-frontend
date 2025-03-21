import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllPayrolls, finalizePayroll } from "../../redux/action/payrollAction";
const PayrollManagement = () => {
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedPayroll, setSelectedPayroll] = useState(null);
  
  // Get payroll data from Redux store
  const { payrolls = [], loading = false, error = null } = useSelector((state) => state.payroll || {});

  useEffect(() => {
    const fetchData = async () => {
      try {
        await dispatch(fetchAllPayrolls());
      } catch (err) {
        console.error('Error fetching payrolls:', err);
      }
    };
    fetchData();
  }, [dispatch]);

  const handleDateChange = (e, dateType) => {
    if (dateType === 'start') {
      setStartDate(e.target.value);
    } else {
      setEndDate(e.target.value);
    }
  };

  const handleReview = (payroll) => {
    setSelectedPayroll(payroll);
    setShowModal(true);
  };

  const closeModal = () => {
    setSelectedPayroll(null);
    setShowModal(false);
  };

  const handleFinalize = async (payrollId) => {
    try {
      const userId = selectedPayroll.userId._id;
      await dispatch(finalizePayroll(payrollId, userId));
      await dispatch(fetchAllPayrolls()); // Refresh the list
      closeModal();
    } catch (err) {
      console.error('Error finalizing payroll:', err);
    }
  };

  // Filter payrolls based on search term and date range
  const filteredPayrolls = payrolls.filter(payroll => {
    if (!payroll?.userId) return false;
    
    // Check for search term match in fname, lname, or email
    const matchesSearch = 
      (payroll.userId.fname || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (payroll.userId.lname || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (payroll.userId.email || '').toLowerCase().includes(searchTerm.toLowerCase());

    if (!payroll.payPeriod?.start) return false;
    
    const payrollDate = new Date(payroll.payPeriod.start);
    const matchesDateRange = (!startDate || payrollDate >= new Date(startDate)) &&
                             (!endDate || payrollDate <= new Date(endDate));

    return matchesSearch && matchesDateRange;
  });

  const calculateTotalDeductions = (deductions) => {
    if (!deductions) return 0;
  
    const taxes = deductions.taxes || 0;
    const CPP = deductions.CPP || 0;
    const EI = deductions.EI || 0;
    const otherDeductions = deductions.otherDeductions || 0;
  
    return (taxes + CPP + EI + otherDeductions).toFixed(2);
  };

  // Calculate total employer cost
  const totalEmployerCost = filteredPayrolls.reduce((total, payroll) => 
    total + (Number(payroll.grossPay) || 0), 0
  ).toFixed(2);

  if (loading) return <div className="p-6">Loading...</div>;
  if (error) return <div className="p-6 text-red-500">{error}</div>;

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Manage Payment</h1>
        <div className="flex items-center gap-4">
          <input
            type="date"
            value={startDate}
            onChange={(e) => handleDateChange(e, 'start')}
            className="px-4 py-2 border rounded-lg"
          />
          <span className="text-gray-400">-</span>
          <input
            type="date"
            value={endDate}
            onChange={(e) => handleDateChange(e, 'end')}
            className="px-4 py-2 border rounded-lg"
          />
        </div>
      </div>

      {/* Total Cost Card */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8 shadow">
        <h2 className="text-gray-600 mb-2">Total Employer cost</h2>
        <p className="text-3xl font-bold text-gray-800">${totalEmployerCost}</p>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Search Employee..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-3 bg-white border border-gray-200 rounded-lg pl-10"
          />
          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            🔍
          </span>
        </div>
      </div>

      {/* Payroll Table */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="p-4 text-left text-gray-600">Employee</th>
              <th className="p-4 text-left text-gray-600">Pay Period</th>
              <th className="p-4 text-left text-gray-600">Gross Pay</th>
              <th className="p-4 text-left text-gray-600">Net Pay</th>
              <th className="p-4 text-left text-gray-600">Status</th>
              <th className="p-4 text-left text-gray-600">Email</th>
              <th className="p-4 text-left text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredPayrolls.map((payroll) => (
              <tr key={payroll._id} className="border-b border-gray-200">
                <td className="p-4 text-gray-700">
                  {payroll.userId.fname} {payroll.userId.lname}
                </td>
                <td className="p-4 text-gray-700">
                  {new Date(payroll.payPeriod.start).toLocaleDateString()} - 
                  {new Date(payroll.payPeriod.end).toLocaleDateString()}
                </td>
                <td className="p-4 text-gray-700">${Number(payroll.grossPay).toFixed(2)}</td>
                <td className="p-4 text-gray-700">${Number(payroll.netPay).toFixed(2)}</td>
                <td className="p-4">
                  <span className={`px-3 py-1 rounded-full text-sm ${
                    payroll.status === "Finalized" 
                      ? "bg-green-100 text-green-800" 
                      : "bg-yellow-100 text-yellow-800"
                  }`}>
                    {payroll.status}
                  </span>
                </td>
                <td className="p-4 text-gray-700">
                  {payroll.userId.email}
                </td>
                <td className="p-4">
                  <button 
                    className="text-blue-500 hover:text-blue-600"
                    onClick={() => handleReview(payroll)}
                  >
                    Review
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Review Modal */}
      {showModal && selectedPayroll && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg w-96 max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-semibold mb-4">Review Payment</h3>
            <div className="space-y-4">
              <div>
                <p className="text-gray-600">Employee</p>
                <p className="font-semibold">
                  {selectedPayroll.userId.fname} {selectedPayroll.userId.lname}
                </p>
              </div>
              <div>
                <p className="text-gray-600">Hours Worked</p>
                <p className="font-semibold">{selectedPayroll.hoursWorked}</p>
              </div>
              <div>
                <p className="text-gray-600">Pay Period</p>
                <p className="font-semibold">
                  {new Date(selectedPayroll.payPeriod.start).toLocaleDateString()} - 
                  {new Date(selectedPayroll.payPeriod.end).toLocaleDateString()}
                </p>
              </div>
              <div>
                <p className="text-gray-600">Gross Pay</p>
                <p className="font-semibold">${Number(selectedPayroll.grossPay).toFixed(2)}</p>
              </div>
              <div>
                <p className="text-gray-600">Deductions</p>
                <div className="pl-4">
                  <p>Taxes: ${selectedPayroll.deductions?.taxes?.toFixed(2) || '0.00'}</p>
                  <p>CPP: ${selectedPayroll.deductions?.CPP?.toFixed(2) || '0.00'}</p>
                  <p>EI: ${selectedPayroll.deductions?.EI?.toFixed(2) || '0.00'}</p>
                  {selectedPayroll.deductions?.otherDeductions > 0 && (
                    <p>Other: ${selectedPayroll.deductions.otherDeductions.toFixed(2)}</p>
                  )}
                  <p className="mt-2 font-semibold">
                    Total Deductions: ${calculateTotalDeductions(selectedPayroll.deductions)}
                  </p>
                </div>
              </div>
              <div>
                <p className="text-gray-600">Net Pay</p>
                <p className="font-semibold">${Number(selectedPayroll.netPay).toFixed(2)}</p>
              </div>
              <div>
                <p className="text-gray-600">Status</p>
                <p className="font-semibold">{selectedPayroll.status}</p>
              </div>
            </div>
            <div className="flex justify-end mt-6">
              <button
                onClick={closeModal}
                className="bg-gray-500 text-white px-4 py-2 rounded mr-2"
              >
                Close
              </button>
              {selectedPayroll.status !== "Finalized" && (
                <button
                  onClick={() => handleFinalize(selectedPayroll._id)}
                  className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                  Finalize
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PayrollManagement;
