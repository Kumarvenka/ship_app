import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function RegisterPage() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'crew',
        portName: '',
    });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        const payload = { ...formData };
        if (formData.role !== 'vendor' && formData.role !== 'driver') {
            delete payload.portName;
        }

        try {
            const response = await fetch('http://localhost:5000/api/auth/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.message || 'Registration failed. Please try again.');
                return;
            }

            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            navigate('/dashboard');

        } catch (err) {
            console.error('Registration error:', err);
            setError('Server error. Please try again later.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen w-screen items-center justify-center bg-gray-900 p-4">
            <div className="w-full max-w-md bg-white rounded-lg shadow-2xl border border-blue-200 overflow-hidden transform transition-all duration-300 hover:shadow-3xl">
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-800 to-blue-600 p-6 text-center text-white">
                    <h2 className="text-3xl font-extrabold flex items-center justify-center gap-3">
                        <span className="text-blue-200 text-4xl">⚓</span> OneMarineX Register
                    </h2>
                    <p className="mt-2 text-blue-100 text-sm">Create your account to get started</p>
                </div>

                {/* Form Body */}
                <div className="p-8">
                    {error && (
                        <div className="mb-6 p-4 bg-red-100 text-red-800 rounded-md border border-red-300 flex items-center gap-2 text-sm font-medium">
                            <span className="text-xl">🚨</span> {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors duration-200 text-gray-900" // Added text-gray-900
                                placeholder="Your full name"
                            />
                        </div>

                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors duration-200 text-gray-900" // Added text-gray-900
                                placeholder="e.g., your.email@onemarinex.com"
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors duration-200 text-gray-900" // Added text-gray-900
                                placeholder="••••••••"
                            />
                        </div>

                        <div>
                            <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                            <select
                                id="role"
                                name="role"
                                value={formData.role}
                                onChange={handleChange}
                                className="mt-1 block w-full px-4 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors duration-200 appearance-none pr-8 text-gray-900" // Added text-gray-900
                            >
                                <option value="crew">Crew</option>
                                <option value="admin">Admin</option>
                                <option value="vendor">Vendor</option>
                                <option value="driver">Driver</option>
                            </select>
                        </div>

                        {(formData.role === 'vendor' || formData.role === 'driver') && (
                            <div>
                                <label htmlFor="portName" className="block text-sm font-medium text-gray-700 mb-1">Port Name</label>
                                <input
                                    type="text"
                                    id="portName"
                                    name="portName"
                                    value={formData.portName}
                                    onChange={handleChange}
                                    required
                                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors duration-200 text-gray-900" // Added text-gray-900
                                    placeholder="e.g., Vizag Port"
                                />
                            </div>
                        )}

                        <button
                            type="submit"
                            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-semibold text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            ) : (
                                'Register Account'
                            )}
                        </button>
                    </form>

                    {/* Login Link */}
                    <p className="mt-8 text-center text-sm text-gray-600">
                        Already have an account?{' '}
                        <a href="/" className="font-medium text-blue-700 hover:text-blue-900 transition-colors duration-200">
                            Login here
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default RegisterPage;