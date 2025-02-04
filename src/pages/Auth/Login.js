import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../../redux/action/authAction';

const Login = () => {

    // Local state for managing form input
    const [email, setEmail] = useState(''); // Initialize email state with empty string
    const [password, setPassword] = useState(''); // State to store password

    // Redux hooks
    const dispatch = useDispatch(); // useDispatch allows us to dispatch actions
    const navigate = useNavigate(); // useNavigate allows us to navigate to the different routes

    const { error, loading } = useSelector((state) => state.auth); // Adjust based on your auth reducer

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
        <div className="move-area">
            <form className="login-form bg-white p-8 rounded-lg shadow-lg w-full max-w-md" onSubmit={handleSubmit}>
                <div className="login-title text-center mb-8">
                    <div className="title-container">
                        <span className="text-4xl font-bold">L</span>
                        <span className="eye-container">
                            <div className="eye"></div>
                            <div className="eye"></div>
                        </span>
                        <span className="text-4xl font-bold">GIN</span>
                    </div>
                </div>

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

            <style jsx>{`
                .move-area {
                    width: 100vw;
                    height: 100vh;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    background-color: rgb(243 244 246);
                }

                .login-form {
                    position: relative;
                    z-index: 1;
                    width: 100%;
                    max-width: 400px;
                    margin: 0 20px;
                }

                .title-container {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 5px;
                }

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
                    height: 40px;
                    width: 40px;
                    background: #CCC;
                }

                .eye:after {
                    content: " ";
                    position: absolute;
                    bottom: 22px;
                    right: 15px;
                    width: 12px;
                    height: 12px;
                    background: #000;
                    border-radius: 50%;
                }
            `}</style>
        </div>
    );
};

export default Login;