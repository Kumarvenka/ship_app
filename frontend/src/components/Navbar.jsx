import { Link, useLocation, useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';

function Navbar() {
    const location = useLocation();
    const navigate = useNavigate();
    const [user, setUser] = useState(null);

    useEffect(() => {
        const fetchUserFromLocalStorage = () => {
            try {
                const storedUser = localStorage.getItem('user');
                setUser(storedUser ? JSON.parse(storedUser) : null);
            } catch (err) {
                console.error("Failed to parse user from localStorage", err);
                setUser(null);
            }
        };
        fetchUserFromLocalStorage();
    }, [location.pathname]);

    const hideNavbar = location.pathname === '/' || location.pathname === '/register';
    if (hideNavbar) return null;

    const role = user?.role;
    const userName = user?.name;

    const handleLogout = () => {
        localStorage.clear();
        setUser(null);
        navigate('/');
    };

    const navLinks = [
        { path: '/dashboard', label: 'Dashboard' },
        ...(role === 'crew' ? [
            { path: '/crew/request-cab', label: 'Request Cab' },
            { path: '/crew/cab-status', label: 'My Cab Requests' },
            { path: '/crew/request-item', label: 'Request Item' },
            { path: '/crew/item-status', label: 'My Item Requests' },
        ] : []),
        ...(role === 'driver' ? [
            { path: '/driver/assigned-cabs', label: 'My Cabs' },
        ] : []),
        ...(role === 'vendor' ? [
            { path: '/vendor/assigned-items', label: 'My Deliveries' },
        ] : []),
        ...(role === 'admin' ? [
            { path: '/admin/cab-overview', label: 'Cab Overview' },
            { path: '/admin/assign-vendors', label: 'Assign Vendors' },
        ] : []),
    ];

    return (
        <nav className="bg-gray-900 shadow-xl p-4 text-white sticky top-0 z-50 w-screen">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center md:items-stretch gap-y-4">
                {/* Logo */}
                <div className="flex-shrink-0">
                    <Link to="/dashboard" className="flex items-center text-white text-2xl font-bold hover:text-blue-200 transition duration-300">
                        <span className="mr-2 text-3xl">⚓</span> OneMarineX
                    </Link>
                </div>

                {/* Navigation Links */}
                <div className="flex flex-wrap justify-center items-center gap-x-4 gap-y-2 flex-grow">
                    {navLinks.map((link) => (
                        <Link
                            key={link.path}
                            to={link.path}
                            className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 
                                ${
                                    location.pathname === link.path
                                        ? 'border-b-2 border-blue-400 text-white'
                                        : 'text-gray-300 hover:text-white hover:bg-gray-800 hover:shadow-sm'
                                }`}
                        >
                            {link.label}
                        </Link>
                    ))}
                </div>

                {/* User Info and Logout */}
                <div className="flex-shrink-0 flex items-center space-x-4">
                    {user && (
                        <span className="text-sm text-gray-400 hidden md:inline">
                            Welcome, {userName} ({role})
                        </span>
                    )}
                    <button
                        onClick={handleLogout}
                        className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-md transition duration-300 shadow"
                    >
                        Logout
                    </button>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;
