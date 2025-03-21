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
                  <button
                    className="text-blue-500 hover:text-blue-600"
                    onClick={() => handleReview(payroll)}
                  >
                    Review
                  </button>
                  <button
                    className="ml-4 text-blue-500 hover:text-blue-600"
                    onClick={() => {
                      console.log(`Navigating to edit page for payroll ID: ${payroll._id}`);
                      navigate(`/payroll/edit/${payroll._id}`); // Navigate to edit page
                    }}
                  >
                    Edit
                  </button>
                  <button
                    className="text-blue-500 hover:text-blue-600"
                    onClick={() => handleDelete(payroll._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
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
                <p className="text-gray-600">Overtime Hours</p>
                <p className="font-semibold">{selectedPayroll.overtimeHours || 0}</p>
              </div>
              <div>
                <p className="text-gray-600">Overtime Rate</p>
                <p className="font-semibold">${selectedPayroll.overtimeRate || 0.00}</p>
              </div>
              <div>
                <p className="text-gray-600">Pay Period</p>
                <p className="font-semibold">
                  {new Date(selectedPayroll.payPeriod.start).toLocaleDateString()} -{" "}
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
                <p>Taxes: ${selectedPayroll.deductions?.taxes ? selectedPayroll.deductions.taxes.toFixed(2) : "0.00"}</p>
                <p>CPP: ${selectedPayroll.deductions?.CPP ? selectedPayroll.deductions.CPP.toFixed(2) : "0.00"}</p>
                <p>EI: ${selectedPayroll.deductions?.EI ? selectedPayroll.deductions.EI.toFixed(2) : "0.00"}</p>
                <p>Other: ${selectedPayroll.deductions?.otherDeductions ? selectedPayroll.deductions.otherDeductions.toFixed(2) : "0.00"}</p>

                </div>
              </div>
              <div>
                <p className="text-gray-600">Net Pay</p>
                <p className="font-semibold">${Number(selectedPayroll.netPay).toFixed(2)}</p>
              </div>
              <div className="flex justify-end gap-4 pt-4">

                
                <button
                  onClick={closeModal}
                  className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 text-gray-800"
                >
                  Close
                </button>
                {selectedPayroll.status !== "Finalized" && (
                  <button
                    onClick={() => handleFinalize(selectedPayroll._id)}
                    className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    Finalize
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Dialog for Deletion */}
      <Dialog open={openDeleteDialog} onClose={cancelDelete}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <p>Are you sure you want to delete this payroll record?</p>
        </DialogContent>
        <DialogActions>
          <Button onClick={cancelDelete} color="primary">
            Cancel
          </Button>
          <Button onClick={confirmDelete} color="secondary">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

    </div>
  );
};

export default PayrollManagement;
