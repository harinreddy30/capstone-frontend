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
  const [successMessage, setSuccessMessage] = useState(""); // State for success message

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
      setGrossPay(payroll.grossPay);
      setNetPay(payroll.netPay);
      setDeductions({
        taxes: payroll.deductions?.taxes || "",
        CPP: payroll.deductions?.CPP || "",
        EI: payroll.deductions?.EI || "",
        otherDeductions: payroll.deductions?.otherDeductions || ""
      });
    }
  }, [payroll]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "grossPay") {
      setGrossPay(value);
    } else if (name === "netPay") {
      setNetPay(value);
    } else {
      setDeductions({
        ...deductions,
        [name]: value
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const updatedPayroll = {
        grossPay,
        netPay,
        deductions
      };
      await dispatch(updatePayroll(payrollId, updatedPayroll));
      setSuccessMessage("Payroll updated successfully!"); // Set success message
      setTimeout(() => {
        navigate("/payroll/management"); // Redirect to Payroll Management page
      }, 2000); // Wait for 2 seconds before navigating
    } catch (err) {
      console.error("Error updating payroll:", err);
    }
  };

  if (loading) return <div className="p-6">Loading...</div>;
  if (error) return <div className="p-6 text-red-500">{error}</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Edit Payroll</h1>
      
      {/* Success message display */}
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
          <h3 className="text-lg font-semibold text-gray-600">Deductions</h3>
          <div className="space-y-4">
            <div>
              <label htmlFor="taxes" className="block text-gray-600">Taxes</label>
              <input
                type="number"
                id="taxes"
                name="taxes"
                value={deductions.taxes}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-lg"
              />
            </div>

            <div>
              <label htmlFor="CPP" className="block text-gray-600">CPP</label>
              <input
                type="number"
                id="CPP"
                name="CPP"
                value={deductions.CPP}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-lg"
              />
            </div>

            <div>
              <label htmlFor="EI" className="block text-gray-600">EI</label>
              <input
                type="number"
                id="EI"
                name="EI"
                value={deductions.EI}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-lg"
              />
            </div>

            <div>
              <label htmlFor="otherDeductions" className="block text-gray-600">Other Deductions</label>
              <input
                type="number"
                id="otherDeductions"
                name="otherDeductions"
                value={deductions.otherDeductions}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-lg"
              />
            </div>
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
