import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation
import { fetchAllPayrolls, finalizePayroll, deletePayroll } from "../../redux/action/payrollAction";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';


const PayrollManagement = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate(); // Initialize navigate hook
  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedPayroll, setSelectedPayroll] = useState(null);

    const [openDeleteDialog, setOpenDeleteDialog] = React.useState(false);
    const [payrollToDelete, setPayrollToDelete] = React.useState(null);

  const { payrolls = [], loading = false, error = null } = useSelector((state) => state.payroll || {});
  console.log(payrolls)

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("Fetching payroll data...");
        await dispatch(fetchAllPayrolls());
        console.log("Payroll data fetched successfully");
      } catch (err) {
        console.error("Error fetching payrolls:", err);
      }
    };
    fetchData();
  }, [dispatch]);

  const handleDateChange = (e, dateType) => {
    if (dateType === "start") {
      setStartDate(e.target.value);
    } else {
      setEndDate(e.target.value);
    }
  };

  const handleReview = (payroll) => {
    console.log("Reviewing payroll: ", payroll);
    setSelectedPayroll(payroll);
    setShowModal(true);
  };

  const closeModal = () => {
    setSelectedPayroll(null);
    setShowModal(false);
  };

  const handleFinalize = async (payrollId) => {
    try {
      console.log("Finalizing payroll with ID:", payrollId);

      // Check if the selectedPayroll exists and has userId
      if (!selectedPayroll || !selectedPayroll.userId || !selectedPayroll.userId._id) {
        throw new Error("User data is incomplete.");
      }

      const userId = selectedPayroll.userId._id;
      await dispatch(finalizePayroll(payrollId, userId));
      console.log("Payroll finalized successfully");
      await dispatch(fetchAllPayrolls()); // Refresh list
      closeModal();
    } catch (err) {
      console.error("Error finalizing payroll:", err);
    }
  };

  const filteredPayrolls = payrolls.filter((payroll) => {
    if (!payroll?.userId || !payroll.payPeriod?.start) return false;

    const matchesSearch =
      (payroll.userId.fname || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (payroll.userId.lname || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (payroll.userId.email || "").toLowerCase().includes(searchTerm.toLowerCase());

    const payrollDate = new Date(payroll.payPeriod.start);
    const matchesDateRange =
      (!startDate || payrollDate >= new Date(startDate)) &&
      (!endDate || payrollDate <= new Date(endDate));

    return matchesSearch && matchesDateRange;
  });

  // console.log("Filtered payrolls:", filteredPayrolls); // Log filtered payrolls

  const totalEmployerCost = filteredPayrolls
    .reduce((total, payroll) => total + (Number(payroll.grossPay) || 0), 0)
    .toFixed(2);

  if (loading) return <div className="p-6">Loading...</div>;
  if (error) return <div className="p-6 text-red-500">{error}</div>;

  const handleDelete = (payrollId) => {
      // Open the confirmation dialog to delete the payroll
      setPayrollToDelete(payrollId);
      setOpenDeleteDialog(true);
    };
  
  const confirmDelete = () => {
      if (payrollToDelete) {
        dispatch(deletePayroll(payrollToDelete)); // Assuming you have a deletePayroll action
        setOpenDeleteDialog(false); // Close the dialog after deleting
      }
    };
  
  const cancelDelete = () => {
      setOpenDeleteDialog(false); // Close the dialog if user cancels
    };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Manage Payment</h1>
        <div className="flex items-center gap-4">
          <input
            type="date"
            value={startDate}
            onChange={(e) => handleDateChange(e, "start")}
            className="px-4 py-2 border rounded-lg"
          />
          <span className="text-gray-400">-</span>
          <input
            type="date"
            value={endDate}
            onChange={(e) => handleDateChange(e, "end")}
            className="px-4 py-2 border rounded-lg"
          />
        </div>
      </div>

      {/* Total Cost */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8 shadow">
        <h2 className="text-gray-600 mb-2">Total Employer Cost</h2>
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
          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">🔍</span>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="p-4 text-left text-gray-600">Employee</th>
              <th className="p-4 text-left text-gray-600">Pay Period</th>
              <th className="p-4 text-left text-gray-600">Gross Pay</th>
              <th className="p-4 text-left text-gray-600">Net Pay</th>
              <th className="p-4 text-left text-gray-600">Deductions</th>
              <th className="p-4 text-left text-gray-600">Status</th>
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
                  {new Date(payroll.payPeriod.start).toLocaleDateString()} -{" "}
                  {new Date(payroll.payPeriod.end).toLocaleDateString()}
                </td>
                <td className="p-4 text-gray-700">${Number(payroll.grossPay).toFixed(2)}</td>
                <td className="p-4 text-gray-700">${Number(payroll.netPay).toFixed(2)}</td>
                <td className="p-4 text-gray-700">
                  {/* Log deductions to inspect their structure */}
                  {console.log('Payroll Deductions:', payroll.deductions)}
                  
                  {/* Calculate the total if deductions exist */}
                  ${(
                    (payroll.deductions?.taxes || 0) + 
                    (payroll.deductions?.CPP || 0) + 
                    (payroll.deductions?.EI || 0) + 
                    (payroll.deductions?.otherDeductions || 0)
                  ).toFixed(2)}
                </td>

                <td className="p-4">
                  <span
                    className={`px-3 py-1 rounded-full text-sm ${
                      payroll.status === "Finalized"
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {payroll.status}
                  </span>
                </td>
                <td className="p-4">
                  <div className="flex items-center space-x-4">
                    <button
                      className="px-3 py-1.5 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors duration-200 flex items-center"
                      onClick={() => handleReview(payroll)}
                    >
                      <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      Review
                    </button>
                    <button
                      className="px-3 py-1.5 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors duration-200 flex items-center"
                      onClick={() => {
                        console.log(`Navigating to edit page for payroll ID: ${payroll._id}`);
                        navigate(`/payroll/edit/${payroll._id}`);
                      }}
                    >
                      <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      Edit
                    </button>
                    <button
                      className="px-3 py-1.5 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors duration-200 flex items-center"
                      onClick={() => handleDelete(payroll._id)}
                    >
                      <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && selectedPayroll && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-8 rounded-lg w-[600px] max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-semibold text-gray-900">Review Payment</h3>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-500"
              >
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Employee</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {selectedPayroll.userId.fname} {selectedPayroll.userId.lname}
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Hours Worked</p>
                  <p className="text-lg font-semibold text-gray-900">{selectedPayroll.hoursWorked}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Overtime Hours</p>
                  <p className="text-lg font-semibold text-gray-900">{selectedPayroll.overtimeHours || 0}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Overtime Rate</p>
                  <p className="text-lg font-semibold text-gray-900">${selectedPayroll.overtimeRate || 0.00}</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Pay Period</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {new Date(selectedPayroll.payPeriod.start).toLocaleDateString()} -{" "}
                    {new Date(selectedPayroll.payPeriod.end).toLocaleDateString()}
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Gross Pay</p>
                  <p className="text-lg font-semibold text-gray-900">${Number(selectedPayroll.grossPay).toFixed(2)}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Net Pay</p>
                  <p className="text-lg font-semibold text-gray-900">${Number(selectedPayroll.netPay).toFixed(2)}</p>
                </div>
              </div>
            </div>

            <div className="mt-6 bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600 mb-2">Deductions</p>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm">Taxes: <span className="font-semibold">${selectedPayroll.deductions?.taxes ? selectedPayroll.deductions.taxes.toFixed(2) : "0.00"}</span></p>
                  <p className="text-sm">CPP: <span className="font-semibold">${selectedPayroll.deductions?.CPP ? selectedPayroll.deductions.CPP.toFixed(2) : "0.00"}</span></p>
                </div>
                <div>
                  <p className="text-sm">EI: <span className="font-semibold">${selectedPayroll.deductions?.EI ? selectedPayroll.deductions.EI.toFixed(2) : "0.00"}</span></p>
                  <p className="text-sm">Other: <span className="font-semibold">${selectedPayroll.deductions?.otherDeductions ? selectedPayroll.deductions.otherDeductions.toFixed(2) : "0.00"}</span></p>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-4 mt-8">
              <button
                onClick={closeModal}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors duration-200"
              >
                Close
              </button>
              {selectedPayroll.status !== "Finalized" && (
                <button
                  onClick={() => handleFinalize(selectedPayroll._id)}
                  className="px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600 transition-colors duration-200"
                >
                  Finalize
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Dialog for Deletion */}
      <Dialog 
        open={openDeleteDialog} 
        onClose={cancelDelete}
        className="rounded-lg"
        PaperProps={{
          style: {
            borderRadius: '0.5rem',
            padding: '1.5rem',
          },
        }}
      >
        <DialogTitle className="text-xl font-semibold">Confirm Deletion</DialogTitle>
        <DialogContent>
          <div className="mt-2">
            <p className="text-gray-500">Are you sure you want to delete this payroll record? This action cannot be undone.</p>
          </div>
        </DialogContent>
        <DialogActions className="p-4">
          <Button 
            onClick={cancelDelete} 
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
          >
            Cancel
          </Button>
          <Button 
            onClick={confirmDelete} 
            className="px-4 py-2 text-white bg-red-500 rounded-md hover:bg-red-600 ml-4"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

    </div>
  );
};

export default PayrollManagement;
