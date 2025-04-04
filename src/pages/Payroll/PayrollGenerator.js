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
    const [showNotification, setShowNotification] = useState(false);
    const [notificationMessage, setNotificationMessage] = useState('');

    const { totalHoursWorked, loading, error } = useSelector(state => state.payroll);

    const showTemporaryNotification = (message) => {
        setNotificationMessage(message);
        setShowNotification(true);
        setTimeout(() => {
            setShowNotification(false);
        }, 3000);
    };

    const handleStartDateChange = (e) => {
        const selectedStart = e.target.value;
        if (!selectedStart) {
            setWeekStartDate('');
            setWeekEndDate('');
            return;
        }

        const start = new Date(selectedStart);
        const end = new Date(start);
        end.setDate(start.getDate() + 6); // auto-set end date to 6 days after
    
        const formattedStart = start.toISOString().split('T')[0];
        const formattedEnd = end.toISOString().split('T')[0];

        setWeekStartDate(formattedStart);
        setWeekEndDate(formattedEnd);

        // Fetch hours for the new date range
        dispatch(fetchTotalHoursForPayPeriod(formattedStart, formattedEnd));
    };
  

    const adjustWeek = (direction) => {
        if (!weekStartDate || !weekEndDate) {
            showTemporaryNotification('Please select the initial week first');
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
      if (!weekStartDate || !weekEndDate) {
        showTemporaryNotification('Please select a pay period before generating payroll');
        return;
      }
      
      navigate('/payroll/generatePayroll', {
        state: {
          user,
          startDate: weekStartDate,
          endDate: weekEndDate,
        },
      });
    };

    return (
        <div className="container mx-auto p-6 bg-gray-50 min-h-screen">
            <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Payroll Generation</h1>
                        <p className="mt-2 text-sm text-gray-600">Generate payroll for employees based on their working hours</p>
                    </div>
                </div>

                {/* Notification */}
                {showNotification && (
                    <div className="fixed top-4 right-4 bg-white rounded-lg shadow-lg p-4 z-50 animate-fade-in-down">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <svg className="h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div className="ml-3">
                                <p className="text-sm text-gray-700">{notificationMessage}</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Week Navigation and Date Pickers */}
                <div className="bg-gray-50 rounded-lg p-6 mb-8">
                    <div className="flex items-center justify-between">
                        <button
                            onClick={() => adjustWeek('previous')}
                            disabled={loading}
                            className={`p-3 rounded-lg ${loading ? 'bg-gray-100 cursor-not-allowed' : 'bg-white hover:bg-gray-50 shadow-sm'}`}
                        >
                            <ChevronLeft size={24} className="text-gray-600" />
                        </button>

                        <div className="flex space-x-6">
                            <div className="flex-1">
                                <label htmlFor="weekStart" className="block text-sm font-medium text-gray-700 mb-2">Week Start Date</label>
                                <input
                                    id="weekStart"
                                    type="date"
                                    value={weekStartDate}
                                    onChange={handleStartDateChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                            <div className="flex-1">
                                <label htmlFor="weekEnd" className="block text-sm font-medium text-gray-700 mb-2">Week End Date</label>
                                <input
                                    id="weekEnd"
                                    type="date"
                                    value={weekEndDate}
                                    onChange={(e) => setWeekEndDate(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                        </div>

                        <button 
                            onClick={() => adjustWeek('next')} 
                            className="p-3 rounded-lg bg-white hover:bg-gray-50 shadow-sm"
                        >
                            <ChevronRight size={24} className="text-gray-600" />
                        </button>
                    </div>
                </div>

                {/* Error Message */}
                {error && <p className="text-red-500 mt-4">{error}</p>}

                {/* Data Table */}
                <div className="mt-6 overflow-hidden rounded-lg border border-gray-200">
                    {totalHoursWorked.length > 0 ? (
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hourly Rate</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Hours</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {totalHoursWorked.map((user) => (
                                    <tr key={user.userId} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                                                    <span className="text-sm font-medium text-blue-800">
                                                        {user.userName[0]}
                                                    </span>
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-gray-900">{user.userName}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">${user.HourlyWage}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">{user.email}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">{user.totalHoursWorked} hours</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <button
                                                onClick={() => handleGeneratePayroll(user)}
                                                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                                            >
                                                Generate Payroll
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        !loading && (
                            <div className="text-center py-12">
                                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                </svg>
                                <h3 className="mt-2 text-sm font-medium text-gray-900">No data available</h3>
                                <p className="mt-1 text-sm text-gray-500">No users available for this week.</p>
                            </div>
                        )
                    )}
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

export default PayrollGenerator;
