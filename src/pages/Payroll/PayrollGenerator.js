import React from "react";

const PayrollGenerator = () => {
  const handleGeneratePayroll = () => {
    // Logic for generating payroll and sending emails
    alert("Payroll generated and emails sent!");
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Payroll Generator</h1>
      <button
        onClick={handleGeneratePayroll}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Generate Payroll
      </button>
    </div>
  );
};

export default PayrollGenerator;
