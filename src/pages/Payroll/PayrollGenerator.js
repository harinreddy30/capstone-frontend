import React, { useState } from 'react';
import { useDispatch, useSelector  } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchTotalHoursForPayPeriod } from '../../redux/action/payrollAction';
import { ChevronLeft, ChevronRight } from 'lucide-react'; // Using lucide icons

const PayrollGenerator = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();


    const [weekStartDate, setWeekStartDate] = useState('');
    const [weekEndDate, setWeekEndDate] = useState('');

    const { totalHoursWorked, loading, error } = useSelector(state => state.payroll);

    const handleGenerate = () => {
        if (!weekStartDate || !weekEndDate) {
            alert('Please select both week start and end dates');
            return;
        }

        dispatch(fetchTotalHoursForPayPeriod(weekStartDate, weekEndDate));
    };

    const handleStartDateChange = (e) => {
        const selectedStart = e.target.value;
        const start = new Date(selectedStart);
        const end = new Date(start);
        end.setDate(start.getDate() + 6); // auto-set end date to 6 days after
    
        setWeekStartDate(selectedStart);
        setWeekEndDate(end.toISOString().split('T')[0]);
    };
  

    const adjustWeek = (direction) => {
        if (!weekStartDate || !weekEndDate) {
            alert('Please select the initial week first');
            return;
        }

        const start = new Date(weekStartDate);
        const end = new Date(weekEndDate);

        const daysToAdd = direction === 'next' ? 7 : -7;

        start.setDate(start.getDate() + daysToAdd);
        end.setDate(end.getDate() + daysToAdd);

        const newStart = start.toISOString().split('T')[0];
        const newEnd = end.toISOString().split('T')[0];

        setWeekStartDate(newStart);
        setWeekEndDate(newEnd);

        dispatch(fetchTotalHoursForPayPeriod(newStart, newEnd));
    };

    const handleGeneratePayroll = (user) => {
      navigate('/payroll/generatePayroll', {
        state: {
          user,
          startDate: weekStartDate,
          endDate: weekEndDate,
        },
      }); // Pass user data to the generatePayroll page
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Total Hours Worked for a Specific Week</h1>

            {/* Week Navigation and Date Pickers */}
            <div className="flex items-center space-x-4 mb-6">
                {/* Previous Week Button */}
                <button
                    onClick={() => adjustWeek('previous')}
                    disabled={loading}
                    className={`p-2 rounded ${loading ? 'bg-gray-100 cursor-not-allowed' : 'bg-gray-200 hover:bg-gray-300'}`}
                >
                    <ChevronLeft size={20} />
                </button>


                <div className="flex space-x-4">
                    <div>
                        <label htmlFor="weekStart" className="block text-sm font-medium">Week Start Date</label>
                        <input
                            id="weekStart"
                            type="date"
                            value={weekStartDate}
                            onChange={handleStartDateChange}
                            className="mt-1 p-2 border border-gray-300 rounded"
                        />
                    </div>
                    <div>
                        <label htmlFor="weekEnd" className="block text-sm font-medium">Week End Date</label>
                        <input
                            id="weekEnd"
                            type="date"
                            value={weekEndDate}
                            onChange={(e) => setWeekEndDate(e.target.value)}
                            className="mt-1 p-2 border border-gray-300 rounded"
                        />
                    </div>
                </div>

                {/* Next Week Button */}
                <button onClick={() => adjustWeek('next')} className="p-2 rounded bg-gray-200 hover:bg-gray-300">
                    <ChevronRight size={20} />
                </button>
            </div>

            {/* Generate Button */}
            <button
                onClick={handleGenerate}
                disabled={loading}
                className={`px-6 py-2 bg-blue-500 text-white font-semibold rounded ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
                {loading ? 'Generating...' : 'Generate'}
            </button>

            {/* Error Message */}
            {error && <p className="text-red-500 mt-4">{error}</p>}

            {/* Data Table or No Users Message */}
            <div className="mt-6">
                {totalHoursWorked.length > 0 ? (
                    <table className="min-w-full bg-white border border-gray-200">
                        <thead>
                            <tr>
                                <th className="py-2 px-4 border-b">Name</th>
                                <th className="py-2 px-4 border-b">Hourly Rate</th>
                                <th className="py-2 px-4 border-b">Role</th>
                                <th className="py-2 px-4 border-b">Email</th>
                                <th className="py-2 px-4 border-b">Total Hours Worked</th>
                                <th className="py-2 px-4 border-b">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {totalHoursWorked.map((user) => (
                                <tr key={user.userId}>
                                    <td className="py-2 px-4 border-b">{user.userName}</td>
                                    <td className="py-2 px-4 border-b">${user.HourlyWage}</td>
                                    <td className="py-2 px-4 border-b">{user.role}</td>
                                    <td className="py-2 px-4 border-b">{user.email}</td>
                                    <td className="py-2 px-4 border-b">{user.totalHoursWorked}</td>
                                    <td className="py-2 px-4 border-b">
                                      <button
                                          onClick={() => handleGeneratePayroll(user)}
                                          className="bg-green-500 hover:bg-green-600 text-white px-4 py-1 rounded"
                                      >
                                          Generate Payroll
                                      </button>
                                  </td>

                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    !loading && <p className="text-gray-600 text-lg">No users available for this week.</p>
                )}
            </div>
        </div>
    );
};

export default PayrollGenerator;
