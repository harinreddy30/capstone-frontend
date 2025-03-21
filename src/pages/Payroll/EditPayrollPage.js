import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { fetchPayrollById, updatePayroll } from "../../redux/action/payrollAction";

const EditPayrollPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { payrollId } = useParams();
  console.log('Navigating to edit payroll with ID:', payrollId);

  const [grossPay, setGrossPay] = useState("");
  const [netPay, setNetPay] = useState("");
  const [deductions, setDeductions] = useState({
    taxes: "",
    CPP: "",
    EI: "",
    otherDeductions: ""
  });
  const [overtimeHours, setOvertimeHours] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const { payroll, loading, error } = useSelector((state) => state.payrollById || {});

  useEffect(() => {
    const fetchData = async () => {
      try {
        await dispatch(fetchPayrollById(payrollId));
      } catch (err) {
        console.error("Error fetching payroll:", err);
      }
    };
  
    if (payrollId) {
      fetchData();
    }
  }, [dispatch, payrollId]);
  
  useEffect(() => {
    if (payroll) {
      console.log("Payroll data loaded:", payroll);
  
      setGrossPay(payroll.grossPay);
      setNetPay(payroll.netPay);
      setDeductions({
        taxes: payroll.deductions?.taxes ?? 0,
        CPP: payroll.deductions?.CPP ?? 0,
        EI: payroll.deductions?.EI ?? 0,
        otherDeductions: payroll.deductions?.otherDeductions ?? 0,
      });
      setOvertimeHours(payroll.overtimeHours || 0);
    }
  }, [payroll]);
  
  const recalculateNetPay = (gross, updatedDeductions, overtimeHours) => {
    const totalDeductions =
      (parseFloat(updatedDeductions.taxes) || 0) +
      (parseFloat(updatedDeductions.CPP) || 0) +
      (parseFloat(updatedDeductions.EI) || 0) +
      (parseFloat(updatedDeductions.otherDeductions) || 0);
  
    const overtimePay = overtimeHours * (parseFloat(gross) || 0) * 1.5; // 1.5x overtime rate
  
    const net = (parseFloat(gross) || 0) + overtimePay - totalDeductions;
  
    console.log("Gross Pay:", gross);
    console.log("Updated Deductions:", updatedDeductions);
    console.log("Total Deductions:", totalDeductions);
    console.log("Overtime Pay:", overtimePay);
    console.log("Recalculated Net Pay:", net);
  
    return net;
  };
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    console.log(`Changed field: ${name} = ${value}`);
  
    if (name === "grossPay") {
      setGrossPay(value);
      const newNet = recalculateNetPay(value, deductions, overtimeHours);
      setNetPay(newNet);
    } else if (name === "netPay") {
      setNetPay(value); // manual override
    } else if (name === "overtimeHours") {
      setOvertimeHours(value);
      const newNet = recalculateNetPay(grossPay, deductions, value);
      setNetPay(newNet);
    } else {
      const updatedDeductions = {
        ...deductions,
        [name]: value
      };
  
      setDeductions(updatedDeductions);
  
      const newNet = recalculateNetPay(grossPay, updatedDeductions, overtimeHours);
      setNetPay(newNet);
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const updatedPayroll = {
      grossPay: parseFloat(grossPay),
      netPay: parseFloat(netPay),
      deductions: {
        taxes: parseFloat(deductions.taxes) || 0,
        CPP: parseFloat(deductions.CPP) || 0,
        EI: parseFloat(deductions.EI) || 0,
        otherDeductions: parseFloat(deductions.otherDeductions) || 0,
      },
      overtimeHours: parseFloat(overtimeHours) || 0
    };
  
    console.log("Submitting updated payroll data:", updatedPayroll);
  
    try {
      await dispatch(updatePayroll(payrollId, updatedPayroll));
      setSuccessMessage("Payroll updated successfully!");
  
      setTimeout(() => {
        navigate("/payroll/management");
      }, 2000);
    } catch (err) {
      console.error("Error updating payroll:", err);
    }
  };
  
  if (loading) return <div className="p-6">Loading...</div>;
  if (error) return <div className="p-6 text-red-500">{error}</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Edit Payroll</h1>

      {successMessage && (
        <div className="mb-4 p-4 bg-green-200 text-green-700 rounded-lg">
          {successMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="mb-4">
          <label htmlFor="grossPay" className="block text-gray-600">Gross Pay</label>
          <input
            type="number"
            id="grossPay"
            name="grossPay"
            value={grossPay}
            onChange={handleInputChange}
            className="w-full p-3 border border-gray-300 rounded-lg"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="netPay" className="block text-gray-600">Net Pay</label>
          <input
            type="number"
            id="netPay"
            name="netPay"
            value={netPay}
            onChange={handleInputChange}
            className="w-full p-3 border border-gray-300 rounded-lg"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="overtimeHours" className="block text-gray-600">Overtime Hours</label>
          <input
            type="number"
            id="overtimeHours"
            name="overtimeHours"
            value={overtimeHours}
            onChange={handleInputChange}
            className="w-full p-3 border border-gray-300 rounded-lg"
          />
        </div>

        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-600">Deductions</h3>
          <div className="space-y-4">
            {["taxes", "CPP", "EI", "otherDeductions"].map((deduction) => (
              <div key={deduction}>
                <label htmlFor={deduction} className="block text-gray-600 capitalize">{deduction}</label>
                <input
                  type="number"
                  id={deduction}
                  name={deduction}
                  value={deductions[deduction]}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={() => navigate("/payroll-management")}
            className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 text-gray-800"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditPayrollPage;
