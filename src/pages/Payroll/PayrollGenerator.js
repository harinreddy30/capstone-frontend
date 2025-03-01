import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllUsers } from "../../redux/action/userAction";
import { fetchAllPayrolls, generatePayroll } from "../../redux/action/payrollAction";

const PayrollGenerator = () => {
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [payrollPeriod, setPayrollPeriod] = useState({
    startDate: "",
    endDate: ""
  });

  // Get users and payrolls from Redux store
  const { users = [] } = useSelector((state) => state.users);
  const { payrolls = [], loading } = useSelector((state) => state.payroll);
  const { user: currentUser } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchAllUsers());
    dispatch(fetchAllPayrolls());
  }, [dispatch]);

  // Calculate payroll statistics
  const payrollStats = {
    totalEmployees: users.length,
    totalPayroll: users.reduce((sum, user) => sum + (user.hourlyWage || 0), 0),
    ytdPayroll: payrolls.reduce((sum, payroll) => sum + (payroll.totalAmount || 0), 0)
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value.toLowerCase());
  };

  const handleGeneratePayroll = () => {
    setShowModal(true);
  };

  const handlePayrollSubmit = async () => {
    if (!payrollPeriod.startDate || !payrollPeriod.endDate) {
      alert("Please select both start and end dates");
      return;
    }

    try {
      await dispatch(generatePayroll(payrollPeriod));
      setShowModal(false);
      // Refresh payroll data
      dispatch(fetchAllPayrolls());
    } catch (error) {
      console.error("Error generating payroll:", error);
      alert("Failed to generate payroll. Please try again.");
    }
  };

  const handleReview = (employee) => {
    setSelectedEmployee(employee);
    setShowReviewModal(true);
  };

  // Filter users based on search
  const filteredEmployees = users.filter(user => 
    user.fname.toLowerCase().includes(searchTerm) ||
    user.lname.toLowerCase().includes(searchTerm) ||
    user.employeeId.toString().includes(searchTerm)
  );

  // Add this new Review Modal component
  const ReviewModal = ({ employee, onClose }) => {
    if (!employee) return null;

    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        <div className="bg-white p-6 rounded-lg w-[600px] relative">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold">Employee Payroll Review</h3>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              ✕
            </button>
          </div>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-gray-600">Employee Name</p>
                <p className="font-semibold">{`${employee.fname} ${employee.lname}`}</p>
              </div>
              <div>
                <p className="text-gray-600">Employee ID</p>
                <p className="font-semibold">{employee.employeeId}</p>
              </div>
              <div>
                <p className="text-gray-600">Hourly Rate</p>
                <p className="font-semibold">${employee.hourlyWage}/hr</p>
              </div>
              <div>
                <p className="text-gray-600">Status</p>
                <p className="font-semibold">Active</p>
              </div>
            </div>

            <div className="mt-6">
              <h4 className="font-semibold mb-2">Recent Payroll History</h4>
              <div className="border rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left">Period</th>
                      <th className="px-4 py-2 text-left">Hours</th>
                      <th className="px-4 py-2 text-left">Amount</th>
                      <th className="px-4 py-2 text-left">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {payrolls
                      .filter(p => p.employeeId === employee.employeeId)
                      .map((payroll, index) => (
                        <tr key={index} className="border-t">
                          <td className="px-4 py-2">{payroll.period}</td>
                          <td className="px-4 py-2">{payroll.hours}</td>
                          <td className="px-4 py-2">${payroll.amount}</td>
                          <td className="px-4 py-2">
                            <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                              Paid
                            </span>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="flex justify-end mt-6">
            <button
              onClick={onClose}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Payroll & History</h2>
        <div className="flex gap-4">
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-4 py-2 border rounded-lg"
          />
          <button 
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            onClick={() => {/* Add download functionality */}}
          >
            Download Report
          </button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-600 text-lg mb-2">Total Employees</h3>
          <p className="text-3xl font-bold">{payrollStats.totalEmployees}</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-600 text-lg mb-2">Total Hourly Wages</h3>
          <p className="text-3xl font-bold">${payrollStats.totalPayroll.toFixed(2)}</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-600 text-lg mb-2">YTD Payroll</h3>
          <p className="text-3xl font-bold">${payrollStats.ytdPayroll.toFixed(2)}</p>
        </div>
      </div>

      <div className="mb-6">
        <input
          type="text"
          placeholder="Search by name or employee ID..."
          value={searchTerm}
          onChange={handleSearch}
          className="w-full p-3 border rounded-lg"
        />
      </div>

      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="p-4 text-left">Employee ID</th>
              <th className="p-4 text-left">Name</th>
              <th className="p-4 text-left">Hourly Rate</th>
              <th className="p-4 text-left">Status</th>
              <th className="p-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredEmployees.map((employee) => (
              <tr key={employee._id} className="border-b hover:bg-gray-50">
                <td className="p-4">{employee.employeeId}</td>
                <td className="p-4">{`${employee.fname} ${employee.lname}`}</td>
                <td className="p-4">${employee.hourlyWage}/hr</td>
                <td className="p-4">
                  <span className="px-3 py-1 rounded-full text-sm bg-green-100 text-green-800">
                    Active
                  </span>
                </td>
                <td className="p-4">
                  <button 
                    className="text-blue-600 hover:text-blue-800"
                    onClick={() => handleReview(employee)}
                  >
                    Review
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6 flex justify-end">
        <button
          onClick={handleGeneratePayroll}
          className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800"
        >
          Generate Payroll
        </button>
      </div>

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg w-96 relative">
            <h3 className="text-xl font-bold mb-4">Generate Payroll</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Start Date</label>
                <input
                  type="date"
                  className="mt-1 block w-full border rounded-md shadow-sm p-2"
                  value={payrollPeriod.startDate}
                  onChange={(e) => setPayrollPeriod(prev => ({...prev, startDate: e.target.value}))}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">End Date</label>
                <input
                  type="date"
                  className="mt-1 block w-full border rounded-md shadow-sm p-2"
                  value={payrollPeriod.endDate}
                  onChange={(e) => setPayrollPeriod(prev => ({...prev, endDate: e.target.value}))}
                />
              </div>
            </div>
            <div className="flex justify-end mt-6 gap-2">
              <button
                onClick={() => setShowModal(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              >
                Cancel
              </button>
              <button 
                onClick={handlePayrollSubmit}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Generate
              </button>
            </div>
          </div>
        </div>
      )}

      {showReviewModal && (
        <ReviewModal 
          employee={selectedEmployee} 
          onClose={() => {
            setShowReviewModal(false);
            setSelectedEmployee(null);
          }}
        />
      )}
    </div>
  );
};

export default PayrollGenerator;