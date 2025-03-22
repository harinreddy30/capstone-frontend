import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { fetchPayrollById, updatePayroll } from "../../redux/action/payrollAction";

const EditPayrollPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { payrollId } = useParams();
  console.log('Editing payroll with ID:', payrollId);

  const [formData, setFormData] = useState({
    grossPay: "",
    netPay: "",
    overtimeHours: "",
    overtimeRate: "",
    hoursWorked: "",
    deductions: {
      taxes: "",
      CPP: "",
      EI: "",
      otherDeductions: ""
    }
  });

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const { loading, error, data } = useSelector((state) => state.payroll.payrollById);

  useEffect(() => {
    if (payrollId) {
      dispatch(fetchPayrollById(payrollId));
    }
  }, [dispatch, payrollId]);

  useEffect(() => {
    console.log("Received payroll data:", data);

    if (data?.payroll) {
      const payroll = data.payroll;
      console.log("Setting form data from payroll:", payroll);
      
      setFormData({
        grossPay: payroll.grossPay?.toString() || "",
        netPay: payroll.netPay?.toString() || "",
        overtimeHours: payroll.overtimeHours?.toString() || "",
        overtimeRate: payroll.overtimeRate?.toString() || "",
        hoursWorked: payroll.hoursWorked?.toString() || "",
        deductions: {
          taxes: payroll.deductions?.taxes?.toString() || "",
          CPP: payroll.deductions?.CPP?.toString() || "",
          EI: payroll.deductions?.EI?.toString() || "",
          otherDeductions: payroll.deductions?.otherDeductions?.toString() || ""
        }
      });
    }
  }, [data]);

  const recalculateNetPay = (data) => {
    const grossPayValue = parseFloat(data.grossPay) || 0;
    const overtimeHoursValue = parseFloat(data.overtimeHours) || 0;
    const overtimeRateValue = parseFloat(data.overtimeRate) || (grossPayValue * 1.5);
    
    const overtimePay = overtimeHoursValue * overtimeRateValue;
    
    const totalDeductions =
      (parseFloat(data.deductions.taxes) || 0) +
      (parseFloat(data.deductions.CPP) || 0) +
      (parseFloat(data.deductions.EI) || 0) +
      (parseFloat(data.deductions.otherDeductions) || 0);

    return (grossPayValue + overtimePay - totalDeductions).toFixed(2);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => {
        const newData = {
          ...prev,
          [parent]: {
            ...prev[parent],
            [child]: value
          }
        };
        const newNetPay = recalculateNetPay(newData);
        return {
          ...newData,
          netPay: newNetPay
        };
      });
    } else {
      setFormData(prev => {
        const newData = {
          ...prev,
          [name]: value
        };
        const newNetPay = recalculateNetPay(newData);
        return {
          ...newData,
          netPay: newNetPay
        };
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowConfirmModal(true);
  };

  const confirmSubmit = async () => {
    try {
      const response = await dispatch(updatePayroll(payrollId, formData));
      if (response) {
        setSuccessMessage("Payroll updated successfully!");
        setShowSuccessModal(true);
        setTimeout(() => {
          navigate("/payroll/management");
        }, 2000);
      }
    } catch (err) {
      console.error("Error updating payroll:", err);
    }
    setShowConfirmModal(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Edit Payroll</h1>
          <button
            onClick={() => navigate("/payroll/management")}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back
          </button>
        </div>

        {successMessage && (
          <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-400 rounded">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-green-700">{successMessage}</p>
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="hoursWorked" className="block text-sm font-medium text-gray-700 mb-1">
                Hours Worked
              </label>
              <input
                type="number"
                name="hoursWorked"
                id="hoursWorked"
                value={formData.hoursWorked}
                onChange={handleInputChange}
                className="focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                placeholder="0"
              />
            </div>

            <div>
              <label htmlFor="grossPay" className="block text-sm font-medium text-gray-700 mb-1">
                Gross Pay
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">$</span>
                </div>
                <input
                  type="number"
                  name="grossPay"
                  id="grossPay"
                  value={formData.grossPay}
                  onChange={handleInputChange}
                  className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md"
                  placeholder="0.00"
                />
              </div>
            </div>

            <div>
              <label htmlFor="overtimeHours" className="block text-sm font-medium text-gray-700 mb-1">
                Overtime Hours
              </label>
              <input
                type="number"
                name="overtimeHours"
                id="overtimeHours"
                value={formData.overtimeHours}
                onChange={handleInputChange}
                className="focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                placeholder="0"
              />
            </div>

            <div>
              <label htmlFor="overtimeRate" className="block text-sm font-medium text-gray-700 mb-1">
                Overtime Rate
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">$</span>
                </div>
                <input
                  type="number"
                  name="overtimeRate"
                  id="overtimeRate"
                  value={formData.overtimeRate}
                  onChange={handleInputChange}
                  className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md"
                  placeholder="0.00"
                />
              </div>
            </div>

            <div>
              <label htmlFor="netPay" className="block text-sm font-medium text-gray-700 mb-1">
                Net Pay
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">$</span>
                </div>
                <input
                  type="number"
                  name="netPay"
                  id="netPay"
                  value={formData.netPay}
                  readOnly
                  className="bg-gray-50 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md"
                  placeholder="0.00"
                />
              </div>
            </div>
          </div>

          <div className="mt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Deductions</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Object.entries(formData.deductions).map(([key, value]) => (
                <div key={key}>
                  <label htmlFor={key} className="block text-sm font-medium text-gray-700 mb-1 capitalize">
                    {key === 'CPP' ? 'CPP' : key === 'EI' ? 'EI' : key.replace(/([A-Z])/g, ' $1').trim()}
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500 sm:text-sm">$</span>
                    </div>
                    <input
                      type="number"
                      name={`deductions.${key}`}
                      id={key}
                      value={value}
                      onChange={handleInputChange}
                      className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md"
                      placeholder="0.00"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-4 pt-6">
            <button
              type="button"
              onClick={() => navigate("/payroll/management")}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-sm w-full mx-4">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 mb-4">
                <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Save Changes</h3>
              <p className="text-sm text-gray-500 mb-4">
                Are you sure you want to save these changes to the payroll record?
              </p>
              <div className="flex justify-center space-x-4">
                <button
                  onClick={() => setShowConfirmModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmSubmit}
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-sm w-full mx-4">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">{successMessage}</h3>
              <p className="text-sm text-gray-500">You will be redirected to the payroll management page.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditPayrollPage;
