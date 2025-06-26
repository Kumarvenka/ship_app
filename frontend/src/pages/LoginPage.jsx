import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function LoginPage() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false); // New loading state

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true); // Start loading

        try {
            const response = await fetch('http://localhost:5000/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.message || 'Login failed. Please check your credentials.');
                return;
            }

            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));

            navigate('/dashboard');
        } catch (err) {
            console.error('Login error:', err);
            setError('Server error. Please try again later.');
        } finally {
            setIsLoading(false); // End loading
        }
    };

    return (
        // Ensure this top-level div spans the entire viewport
        // and correctly centers its content.
        <div className="flex min-h-screen w-screen items-center justify-center bg-gray-900 p-4">
            <div className="w-full max-w-md bg-white rounded-lg shadow-2xl border border-blue-200 overflow-hidden transform transition-all duration-300 hover:shadow-3xl">
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-800 to-blue-600 p-6 text-center text-white">
                    <h2 className="text-3xl font-extrabold flex items-center justify-center gap-3">
                        <span className="text-blue-200 text-4xl">⚓</span> OneMarineX Login
                    </h2>
                    <p className="mt-2 text-blue-100 text-sm">Access your crew & merchant services</p>
                </div>

                {/* Form Body */}
                <div className="p-8">
                    {error && (
                        <div className="mb-6 p-4 bg-red-100 text-red-800 rounded-md border border-red-300 flex items-center gap-2 text-sm font-medium">
                            <span className="text-xl">🚨</span> {error}
                        </div>
                    )}

                    <form onSubmit={handleLogin} className="space-y-6">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors duration-200 text-gray-900" // Added text-gray-900
                                placeholder="e.g., your.name@onemarinex.com"
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                            <input
                                type="password"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors duration-200 text-gray-900" // Added text-gray-900
                                placeholder="••••••••"
                            />
                        </div>
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
                                'Login'
                            )}
                        </button>
                    </form>

                    {/* Registration Link */}
                    <p className="mt-8 text-center text-sm text-gray-600">
                        Don’t have an account?{' '}
                        <a href="/register" className="font-medium text-blue-700 hover:text-blue-900 transition-colors duration-200">
                            Register here
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default LoginPage;