import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../../redux/slices/authAction';

const Login = () => {

    // Local state for managing form input
    const [email, setEmail] = useState(''); // Initialize email state with empty string
    const [password, setPassword] = useState(''); // State to store password

    // Redux hooks
    const dispatch = useDispatch(); // useDispatch allows us to dispatch actions
    const navigate = useNavigate(); // useNavigate allows us to navigate to the different routes

    const { error, loading } = useSelector((state) => state.auth); // Adjust based on your auth reducer

    // This will triggered upon called
    const handleSubmit = async (e) => {

        e.preventDefault(); // Prevent the form from submitting
        const success = await dispatch(loginUser({ email, password })) // Dispatch the Login action with email and password
        
        if (!success) {
            console.error('Login failed: No data received');
            return;
        }        
        
        if (success) {
            const userRole = success.user.role; // Assuming role is returned from the backend

            if (!userRole) {
                console.error('Error: Role is missing in the response');
                navigate('/'); // Redirect to a safe fallback route
                return;
            }

            // Based on the user role, navigate to proper dashboard
            switch (userRole) {
                case 'Employee':
                    navigate('/employee/dashboard');
                    break;
                case 'HR':
                    navigate('/hr/dashboard');
                    break;
                case 'Manager':
                    navigate('/manager/dashboard');
                    break;
                case 'PayrollManager':
                    navigate('/payroll/dashboard');
                    break;
                case 'SuperAdmin':
                    navigate('/admin/dashboard');
                    break;
                default:
                    navigate('/');
            }
        }
        
    };

    return (
        <div className="login-container">
            <form className="login-form" onSubmit={handleSubmit}>
                <h2>Login</h2>
                {error && <p className="error-message">{error}</p>}

                <div className="form-group">
                    <label htmlFor="email">Email:</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)} // Update email state when the input changes
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="password">Password:</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)} // Update password state when the input changes
                        required
                    />
                </div>

                {/* Button to submit the form, disabled when loading */}
                <button type="submit" className="login-button" disabled={loading}>
                    {loading ? 'Logging in...' : 'Login'} {/* Show loading text when logging in */}
                </button>
            </form>
        </div>
    )

}

export default Login;
