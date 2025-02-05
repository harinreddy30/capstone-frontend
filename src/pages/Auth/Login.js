import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../../redux/action/authAction';
// import logo from '../../assets/logo.png'; // Add your logo

const Login = () => {
    // Local state for managing form input
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [keepLoggedIn, setKeepLoggedIn] = useState(false);

    // Redux hooks
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { error, loading } = useSelector((state) => state.auth);

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

    // This will triggered upon called
    const handleSubmit = async (e) => {
        console.log(`${email}, ${password}`)
        e.preventDefault();
        const success = await dispatch(loginUser({ email, password }))
        console.log(success)
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
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
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
                            <a href="#" className="text-sm text-blue-600 hover:text-blue-800">
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
                        Welcome to Security Management System
                    </h1>
                    <p className="text-xl">
                        Streamline your security operations and enhance efficiency
                    </p>
                </div>
            </div>

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