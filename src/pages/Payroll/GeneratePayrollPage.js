import React from 'react';
import { useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { generatePayroll } from '../../redux/action/payrollAction'; // Assuming you have this action in your redux actions

const GeneratePayroll = () => {
  const { state } = useLocation();
  const { user, startDate, endDate } = state;

  // Calculate gross pay
  const grossPay = user.totalHoursWorked * user.HourlyWage;

  // Calculate deductions
  const taxes = grossPay * 0.15; // Example tax rate: 15%
  const cpp = grossPay * 0.0595; // Canada Pension Plan deduction
  const ei = grossPay * 0.0163; // Employment Insurance deduction
  const totalDeductions = taxes + cpp + ei;

  // Calculate net pay
  const netPay = grossPay - totalDeductions;

  const dispatch = useDispatch();

  const handleGeneratePayroll = () => {
    const payrollData = {
      userId: user.id, // Assuming the user has an 'id' field
      payPeriodStart: startDate,
      payPeriodEnd: endDate,
      grossPay,
      netPay,
      totalDeductions,
      taxes,
      cpp,
      ei,
    };

    // Call Redux action to generate payroll
    dispatch(generatePayroll(payrollData))
      .then(() => {
        alert('Payroll generated successfully!');
      })
      .catch((error) => {
        console.error(error);
        alert('There was an error generating payroll.');
      });
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Generate Payroll</h1>

      {/* Employer Details */}
      <div className="mb-4">
        <p><strong>Employer Name:</strong> {user.userName}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Role:</strong> {user.role}</p>
        <p><strong>Week Start Date:</strong> {startDate}</p>
        <p><strong>Week End Date:</strong> {endDate}</p>
        <p><strong>Total Hours Worked:</strong> {user.totalHoursWorked}</p>
        <p><strong>Hourly Wage:</strong> ${user.HourlyWage}</p>
        <p><strong>Gross Pay:</strong> ${grossPay.toFixed(2)}</p>
      </div>

      {/* Breakdown of deductions and net pay */}
      <div className="mb-4">
        <h3 className="font-semibold">Deductions:</h3>
        <p><strong>Taxes (15%):</strong> ${taxes.toFixed(2)}</p>
        <p><strong>Canada Pension Plan (CPP):</strong> ${cpp.toFixed(2)}</p>
        <p><strong>Employment Insurance (EI):</strong> ${ei.toFixed(2)}</p>
        <p><strong>Total Deductions:</strong> ${totalDeductions.toFixed(2)}</p>
        <p><strong>Net Pay:</strong> ${netPay.toFixed(2)}</p>
      </div>

      {/* Confirm and Generate Payroll Button */}
      <button
        onClick={handleGeneratePayroll}
        className="px-6 py-2 bg-blue-500 text-white font-semibold rounded"
      >
        Confirm and Generate Payroll
      </button>
    </div>
  );
};

export default GeneratePayroll;
