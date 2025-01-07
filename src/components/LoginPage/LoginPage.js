import React from "react";
import "./LoginPage.css";

const LoginPage = () => {
  return (
    <div className="login-page">
      <div className="login-container">
        <h2>Login</h2>
        <form>
          <label htmlFor="username">Username</label>
          <input type="text" id="username" />
          <label htmlFor="password">Password</label>
          <input type="password" id="password" />
          <button type="submit">Login</button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;




// import React, { useState } from "react";
// import "./LoginPage.css"; // Import the stylesheet

// const LoginPage = () => {
//   const [formData, setFormData] = useState({
//     username: "",
//     password: "",
//     rememberMe: false,
//   });

//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setFormData({
//       ...formData,
//       [name]: type === "checkbox" ? checked : value,
//     });
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     console.log("Form Data:", formData);
//     // Add login logic here
//   };

//   return (
//     <div className="login-page">
//       {/* Left Section */}
//       <div className="login-form-container">
//         <form onSubmit={handleSubmit} className="login-form">
//           <h2 className="login-title">SHIFTSMART</h2>
//           <div className="form-group">
//             <label htmlFor="username">Username</label>
//             <input
//               type="text"
//               id="username"
//               name="username"
//               value={formData.username}
//               onChange={handleChange}
//             />
//           </div>
//           <div className="form-group">
//             <label htmlFor="password">Password</label>
//             <input
//               type="password"
//               id="password"
//               name="password"
//               value={formData.password}
//               onChange={handleChange}
//             />
//           </div>
//           <div className="form-options">
//             <label>
//               <input
//                 type="checkbox"
//                 name="rememberMe"
//                 checked={formData.rememberMe}
//                 onChange={handleChange}
//               />
//               Remember Me
//             </label>
//             <a href="/forgot-password" className="forgot-password">
//               Forgot Password
//             </a>
//           </div>
//           <button type="submit" className="login-button">
//             Login
//           </button>
//         </form>
//       </div>

//       {/* Right Section */}
//       <div className="login-image-container">
//         {/* Add a background image via CSS */}
//       </div>
//     </div>
//   );
// };

// export default LoginPage;
