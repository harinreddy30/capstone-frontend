import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
// Import your schedule actions here
// import { fetchSchedule } from '../../redux/action/scheduleAction';

const MySchedule = () => {
  const dispatch = useDispatch();
  // const { schedule, loading, error } = useSelector((state) => state.schedule);
  const [currentWeek, setCurrentWeek] = useState(new Date());

  // Placeholder schedule data - replace with actual data from Redux
  const [scheduleData, setScheduleData] = useState({
    Monday: { shift: '9:00 AM - 5:00 PM', site: 'Downtown Office' },
    Tuesday: { shift: '9:00 AM - 5:00 PM', site: 'Downtown Office' },
    Wednesday: { shift: '10:00 AM - 6:00 PM', site: 'West Branch' },
    Thursday: { shift: '9:00 AM - 5:00 PM', site: 'Downtown Office' },
    Friday: { shift: '9:00 AM - 5:00 PM', site: 'East Branch' },
  });

  // useEffect(() => {
  //   dispatch(fetchSchedule());
  // }, [dispatch]);

  const handlePreviousWeek = () => {
    const prevWeek = new Date(currentWeek);
    prevWeek.setDate(prevWeek.getDate() - 7);
    setCurrentWeek(prevWeek);
  };

  const handleNextWeek = () => {
    const nextWeek = new Date(currentWeek);
    nextWeek.setDate(nextWeek.getDate() + 7);
    setCurrentWeek(nextWeek);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">My Schedule</h2>
        <div className="flex gap-4">
          <button
            onClick={handlePreviousWeek}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
          >
            Previous Week
          </button>
          <button
            onClick={handleNextWeek}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
          >
            Next Week
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-50">
              <th className="py-3 px-4 border-b text-left">Day</th>
              <th className="py-3 px-4 border-b text-left">Shift</th>
              <th className="py-3 px-4 border-b text-left">Site</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(scheduleData).map(([day, data]) => (
              <tr key={day} className="border-b hover:bg-gray-50">
                <td className="py-3 px-4">{day}</td>
                <td className="py-3 px-4">{data.shift}</td>
                <td className="py-3 px-4">{data.site}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MySchedule;