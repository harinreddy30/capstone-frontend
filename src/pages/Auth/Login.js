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
        console.log(success)
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
        <div className="login-container min-h-screen flex items-center justify-center bg-gray-100">
            <form className="login-form bg-white p-8 rounded-lg shadow-lg w-full max-w-md" onSubmit={handleSubmit}>
                <h2 className="text-2xl font-semibold mb-6 text-center">Login</h2>

                {error && <p className="error-message text-red-500 text-center mb-4">{error}</p>}

                <div className="form-group mb-4">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email:</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="mt-2 p-3 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                </div>

                <div className="form-group mb-6">
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password:</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="mt-2 p-3 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                </div>

                <button
                    type="submit"
                    className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                    disabled={loading}
                >
                    {loading ? 'Logging in...' : 'Login'}
                </button>
            </form> 
        </div>

    )

}

export default Login;
