// import React from 'react';
// import './InputAvailability.css'; 

// const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

// const InputAvailability = () => {
//   const [availability, setAvailability] = useState(
//     daysOfWeek.reduce((acc, day) => {
//       acc[day] = [];
//       return acc;
//     }, {})
//   );

//   const handleAddInterval = (day) => {
//     setAvailability((prevAvailability) => ({
//       ...prevAvailability,
//       [day]: [...prevAvailability[day], { start: '', end: '' }],
//     }));
//   };

//   const handleIntervalChange = (day, index, field, value) => {
//     setAvailability((prevAvailability) => {
//       const updatedIntervals = [...prevAvailability[day]];
//       updatedIntervals[index][field] = value;
//       return {
//         ...prevAvailability,
//         [day]: updatedIntervals,
//       };
//     });
//   };

//   const handleRemoveInterval = (day, index) => {
//     setAvailability((prevAvailability) => {
//       const updatedIntervals = prevAvailability[day].filter((_, i) => i !== index);
//       return {
//         ...prevAvailability,
//         [day]: updatedIntervals,
//       };
//     });
//   };

//   const handleSubmit = () => {
//     console.log('User availability:', availability);
//     alert('Availability saved! Check console for details.');
//   };

//   return (
//     <div className="input-availability-container">
//       <h1>Set Your Availability</h1>
//       {daysOfWeek.map((day) => (
//         <div key={day} className="day-section">
//           <h2>{day}</h2>
//           {availability[day].map((interval, index) => (
//             <div key={index} className="interval-input">
//               <input
//                 type="time"
//                 value={interval.start}
//                 onChange={(e) => handleIntervalChange(day, index, 'start', e.target.value)}
//                 placeholder="Start time"
//               />
//               <input
//                 type="time"
//                 value={interval.end}
//                 onChange={(e) => handleIntervalChange(day, index, 'end', e.target.value)}
//                 placeholder="End time"
//               />
//               <button
//                 className="remove-button"
//                 onClick={() => handleRemoveInterval(day, index)}
//               >
//                 Remove
//               </button>
//             </div>
//           ))}
//           <button className="add-interval-button" onClick={() => handleAddInterval(day)}>
//             Add Interval
//           </button>
//         </div>
//       ))}
//       <button className="submit-button" onClick={handleSubmit}>Save Availability</button>
//     </div>
//   );
// };

// export default InputAvailability;