import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { generatePayroll } from '../../redux/action/payrollAction';

const GeneratePayroll = () => {
  const { state } = useLocation();
  const { user, startDate, endDate } = state || {};
  
  console.log('Received state:', state);
  console.log('Dates:', { startDate, endDate });
  
  const navigate = useNavigate();
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [notificationType, setNotificationType] = useState('success'); // 'success' or 'error'
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Constants
  const regularHours = 40; // Assuming regular hours in a workweek
  const overtimeRate = 1.5; // Overtime pay rate (1.5 times regular hourly wage)

  // Calculate gross pay with overtime
  const regularHoursWorked = user.totalHoursWorked > regularHours ? regularHours : user.totalHoursWorked;
  const overtimeHoursWorked = user.totalHoursWorked > regularHours ? user.totalHoursWorked - regularHours : 0;

  const regularPay = regularHoursWorked * user.HourlyWage;
  const overtimePay = overtimeHoursWorked * user.HourlyWage * overtimeRate;
  const grossPay = regularPay + overtimePay;

  // Calculate deductions
  const taxes = grossPay * 0.15; // Example tax rate: 15%
  const cpp = grossPay * 0.0595; // Canada Pension Plan deduction
  const ei = grossPay * 0.0163; // Employment Insurance deduction
  const totalDeductions = taxes + cpp + ei;

  // Calculate net pay
  const netPay = grossPay - totalDeductions;

  const dispatch = useDispatch();

  const showTemporaryNotification = (message, type = 'success') => {
    setNotificationMessage(message);
    setNotificationType(type);
    setShowNotification(true);
    setTimeout(() => {
      setShowNotification(false);
    }, 5000);
  };

  const validatePayrollData = () => {
    console.log('Validating payroll data:', { userId: user.userId, startDate, endDate });
    
    if (!user.userId) {
      throw new Error('Employee ID is required');
    }
    if (!startDate || startDate === 'undefined' || startDate === 'null') {
      throw new Error('Start date is required');
    }
    if (!endDate || endDate === 'undefined' || endDate === 'null') {
      throw new Error('End date is required');
    }
    if (!user.HourlyWage || user.HourlyWage <= 0) {
      throw new Error('Invalid hourly wage');
    }
    if (user.totalHoursWorked < 0) {
      throw new Error('Invalid hours worked');
    }
  };

  const handleGeneratePayroll = async () => {
    if (isSubmitting) return;
    
    try {
      // Validate data first
      validatePayrollData();

      setIsSubmitting(true);
      
      const payrollData = {
        employeeId: user.userId,
        payPeriod: {
          startDate: new Date(startDate).toISOString().split('T')[0],
          endDate: new Date(endDate).toISOString().split('T')[0]
        },
        workDetails: {
          regularHours: parseFloat(regularHoursWorked.toFixed(2)),
          overtimeHours: parseFloat(overtimeHoursWorked.toFixed(2)),
          hourlyRate: parseFloat(user.HourlyWage.toFixed(2)),
          overtimeRate: overtimeRate
        },
        earnings: {
          regularPay: parseFloat(regularPay.toFixed(2)),
          overtimePay: parseFloat(overtimePay.toFixed(2)),
          grossPay: parseFloat(grossPay.toFixed(2))
        },
        deductions: {
          tax: parseFloat(taxes.toFixed(2)),
          cpp: parseFloat(cpp.toFixed(2)),
          ei: parseFloat(ei.toFixed(2)),
          total: parseFloat(totalDeductions.toFixed(2))
        },
        netPay: parseFloat(netPay.toFixed(2))
      };

      console.log('Attempting to generate payroll with data:', {
        employeeId: payrollData.employeeId,
        dates: payrollData.payPeriod,
        hours: {
          regular: payrollData.workDetails.regularHours,
          overtime: payrollData.workDetails.overtimeHours
        },
        pay: {
          regular: payrollData.earnings.regularPay,
          overtime: payrollData.earnings.overtimePay,
          gross: payrollData.earnings.grossPay,
          net: payrollData.netPay
        }
      });

      const result = await dispatch(generatePayroll(payrollData));
      
      if (result && result.success) {
        showTemporaryNotification('Payroll generated successfully!');
        setTimeout(() => {
          navigate('/payroll/generator');
        }, 2000);
      } else {
        console.error('Payroll generation failed:', result);
        throw new Error(result?.message || 'Failed to generate payroll');
      }
    } catch (error) {
      console.error('Detailed error information:', {
        name: error.name,
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      
      let errorMessage = 'There was an error generating payroll.';
      
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      showTemporaryNotification(errorMessage, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto p-6 bg-gray-50 min-h-screen">
      {/* Notification */}
      {showNotification && (
        <div className={`fixed top-4 right-4 z-50 rounded-lg shadow-lg p-4 ${
          notificationType === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
        } animate-fade-in-down`}>
          <div className="flex items-center">
            <div className="flex-shrink-0">
              {notificationType === 'success' ? (
                <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              )}
            </div>
            <div className="ml-3">
              <p className="text-sm">{notificationMessage}</p>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Generate Payroll</h1>
            <p className="mt-2 text-sm text-gray-600">Review and confirm payroll details before generating</p>
          </div>
        </div>

        {/* Employee Details Card */}
        <div className="bg-gray-50 rounded-lg p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Employee Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-center space-x-4">
              <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                <span className="text-lg font-medium text-blue-800">
                  {user.userName[0]}
                </span>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-900">{user.userName}</h3>
                <p className="text-sm text-gray-500">{user.email}</p>
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-500">Role</p>
              <p className="text-sm font-medium text-gray-900">{user.role}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Pay Period</p>
              <p className="text-sm font-medium text-gray-900">{startDate} to {endDate}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Hours Worked</p>
              <p className="text-sm font-medium text-gray-900">{user.totalHoursWorked} hours</p>
            </div>
          </div>
        </div>

        {/* Payroll Details Card */}
        <div className="bg-gray-50 rounded-lg p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Payroll Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-gray-500">Hourly Wage</p>
              <p className="text-lg font-semibold text-gray-900">${user.HourlyWage}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Regular Hours</p>
              <p className="text-lg font-semibold text-gray-900">{regularHoursWorked} hours</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Overtime Hours</p>
              <p className="text-lg font-semibold text-gray-900">{overtimeHoursWorked} hours</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Overtime Rate</p>
              <p className="text-lg font-semibold text-gray-900">{overtimeRate}x</p>
            </div>
          </div>
        </div>

        {/* Earnings Card */}
        <div className="bg-gray-50 rounded-lg p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Earnings</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-500">Regular Pay</p>
                <p className="text-sm text-gray-900">{regularHoursWorked} hours × ${user.HourlyWage}</p>
              </div>
              <p className="text-lg font-semibold text-gray-900">${regularPay.toFixed(2)}</p>
            </div>
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-500">Overtime Pay</p>
                <p className="text-sm text-gray-900">{overtimeHoursWorked} hours × ${user.HourlyWage} × {overtimeRate}</p>
              </div>
              <p className="text-lg font-semibold text-gray-900">${overtimePay.toFixed(2)}</p>
            </div>
            <div className="border-t border-gray-200 pt-4">
              <div className="flex justify-between items-center">
                <p className="text-base font-medium text-gray-900">Gross Pay</p>
                <p className="text-xl font-bold text-blue-600">${grossPay.toFixed(2)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Deductions Card */}
        <div className="bg-gray-50 rounded-lg p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Deductions</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-500">Taxes (15%)</p>
                <p className="text-sm text-gray-900">${grossPay.toFixed(2)} × 15%</p>
              </div>
              <p className="text-lg font-semibold text-gray-900">${taxes.toFixed(2)}</p>
            </div>
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-500">Canada Pension Plan (CPP)</p>
                <p className="text-sm text-gray-900">${grossPay.toFixed(2)} × 5.95%</p>
              </div>
              <p className="text-lg font-semibold text-gray-900">${cpp.toFixed(2)}</p>
            </div>
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-500">Employment Insurance (EI)</p>
                <p className="text-sm text-gray-900">${grossPay.toFixed(2)} × 1.63%</p>
              </div>
              <p className="text-lg font-semibold text-gray-900">${ei.toFixed(2)}</p>
            </div>
            <div className="border-t border-gray-200 pt-4">
              <div className="flex justify-between items-center">
                <p className="text-base font-medium text-gray-900">Total Deductions</p>
                <p className="text-xl font-bold text-red-600">${totalDeductions.toFixed(2)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Net Pay Card */}
        <div className="bg-blue-50 rounded-lg p-6 mb-8">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-blue-600">Net Pay</p>
              <p className="text-2xl font-bold text-blue-700">${netPay.toFixed(2)}</p>
            </div>
            <button
              onClick={handleGeneratePayroll}
              disabled={isSubmitting}
              className={`px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200 ${
                isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isSubmitting ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Generating...
                </span>
              ) : (
                'Confirm and Generate Payroll'
              )}
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in-down {
          0% {
            opacity: 0;
            transform: translateY(-10px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-down {
          animation: fade-in-down 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default GeneratePayroll;
