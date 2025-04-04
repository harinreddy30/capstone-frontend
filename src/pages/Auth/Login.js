import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { loginUser, forgotPassword } from '../../redux/action/authAction';
// import logo from '../../assets/logo.png'; // Add your logo

const Login = () => {
    // Local state for managing form input
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [keepLoggedIn, setKeepLoggedIn] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [forgotPasswordModal, setForgotPasswordModal] = useState(false); // For forgot password modal
    const [forgotEmail, setForgotEmail] = useState(''); // Email for password reset


    // Redux hooks
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { error, loading } = useSelector((state) => state.auth);

    // Handle forgot password form submission
    const handleForgotPasswordSubmit = async (e) => {
        e.preventDefault();
        if (!forgotEmail) {
            console.error('Please provide an email for reset');
            return;
        }
        const success = await dispatch(forgotPassword({ email: forgotEmail }));
        if (!success) {
            console.error('Forgot Password request failed');
            return;
        }
        console.log('Reset password email sent');
        setForgotPasswordModal(false); // Close the modal after submission
    };

    // Eye movement animation handler
    useEffect(() => {
        const handleMouseMove = (e) => {
            const eyes = document.querySelectorAll('.eye');
            eyes.forEach(eye => {
                const x = (eye.getBoundingClientRect().left) + (eye.clientWidth / 2);
                const y = (eye.getBoundingClientRect().top) + (eye.clientHeight / 2);
                const rad = Math.atan2(e.pageX - x, e.pageY - y);
                const rot = (rad * (180 / Math.PI) * -1) + 180;
                eye.style.transform = `rotate(${rot}deg)`;
            });
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    // This will be triggered on form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email || !password) {
            console.error('Please provide both email and password');
            return;
        }
        
        const success = await dispatch(loginUser({ email, password }));

        if (!success) {
            console.error('Login failed: No data received');
            return;
        }

        if (success) {
            const userRole = success.user.role;

            if (!userRole) {
                console.error('Error: Role is missing in the response');
                navigate('/');
                return;
            }

            // Based on the user role, navigate to the appropriate dashboard
            switch (userRole) {
                case 'Employee':
                    navigate('/employee/');
                    break;
                case 'HR':
                    navigate('/hr/');
                    break;
                case 'Manager':
                    navigate('/manager/');
                    break;
                case 'PayrollManager':
                    navigate('/payroll/management');
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
        <div className="flex h-screen">
            {/* Left Side - Login Form */}
            <div className="w-1/2 bg-[#f5f5f3] flex items-center justify-center p-8">
                <div className="max-w-md w-full">
                    {/* Logo and Moving Eyes */}
                    <div className="mb-8 text-center">
                        {/* <img src={logo} alt="Logo" className="h-12 mx-auto mb-6" /> */}
                        <div className="title-container">
                            <span className="text-4xl font-bold">L</span>
                            <span className="eye-container">
                                <div className="eye"></div>
                                <div className="eye"></div>
                            </span>
                            <span className="text-4xl font-bold">GIN</span>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && <p className="text-red-500 text-center">{error}</p>}

                        {/* Email Input */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Email
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>

                        {/* Password Input */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-2 top-2 text-gray-500"
                                >
                                    {showPassword ? 'Hide' : 'Show'}
                                </button>
                            </div>
                        </div>

                        {/* Keep Me Logged In */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    checked={keepLoggedIn}
                                    onChange={(e) => setKeepLoggedIn(e.target.checked)}
                                    className="h-4 w-4 text-blue-600"
                                />
                                <label className="ml-2 text-sm text-gray-600">
                                    Keep me logged in
                                </label>
                            </div>
                            <a
                                href="#"
                                className="text-sm text-blue-600 hover:text-blue-800"
                                onClick={() => setForgotPasswordModal(true)} // Open the modal
                            >
                                Forgot password?
                            </a>
                        </div>

                        {/* Login Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 bg-[#4c7eff] text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            {loading ? 'Logging in...' : 'Login'}
                        </button>
                    </form>
                </div>
            </div>

            {/* Right Side - Content */}
            <div className="w-1/2 bg-[#4c7eff] flex items-center justify-center p-12">
                <div className="text-center text-white">
                    <h1 className="text-4xl font-bold mb-6">
                        Welcome to Schedule Management System
                    </h1>
                    <p className="text-xl">
                        Streamline your Schedule operations and enhance efficiency
                    </p>
                </div>
            </div>

            {/* Forgot Password Modal */}
            {forgotPasswordModal && (
                <div className="fixed inset-0 bg-gray-700 bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg max-w-md w-full">
                        <h2 className="text-xl font-semibold mb-4">Forgot Password</h2>
                        <form onSubmit={handleForgotPasswordSubmit}>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Enter your email
                                </label>
                                <input
                                    type="email"
                                    value={forgotEmail}
                                    onChange={(e) => setForgotEmail(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                            </div>
                            <div className="flex justify-end mt-4">
                                <button
                                    type="button"
                                    onClick={() => setForgotPasswordModal(false)}
                                    className="text-sm text-blue-600 hover:text-blue-800 mr-4"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-600 text-white rounded-md"
                                >
                                    Send Reset Link
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <style jsx>{`
                .eye-container {
                    display: inline-flex;
                    align-items: center;
                    gap: 5px;
                    margin: 0 5px;
                }

                .eye {
                    position: relative;
                    display: inline-block;
                    border-radius: 50%;
                    height: 30px;
                    width: 30px;
                    background: #CCC;
                }

                .eye:after {
                    content: " ";
                    position: absolute;
                    bottom: 17px;
                    right: 10px;
                    width: 10px;
                    height: 10px;
                    background: #000;
                    border-radius: 50%;
                }
            `}</style>
        </div>
    );
};

export default Login;
