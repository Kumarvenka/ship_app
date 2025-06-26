import { useEffect, useState } from 'react';

function AdminCabOverview() {
    const [cabRequests, setCabRequests] = useState([]);
    const [drivers, setDrivers] = useState([]);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true); // New loading state
    const token = localStorage.getItem('token');

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError('');
            setMessage('');
            await Promise.all([fetchCabRequests(), fetchDrivers()]);
            setLoading(false);
        };
        fetchData();
    }, []);

    const fetchCabRequests = async () => {
        try {
            const res = await fetch('http://localhost:5000/api/admin/cab-requests', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const data = await res.json();
            if (res.ok) {
                setCabRequests(data);
            } else {
                setError(data.message || 'Failed to fetch cab requests.');
            }
        } catch (err) {
            console.error('Failed to fetch cab requests:', err);
            setError('Server error fetching cab requests.');
        }
    };

    const fetchDrivers = async () => {
        try {
            const res = await fetch('http://localhost:5000/api/admin/drivers', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const data = await res.json();
            if (res.ok) {
                setDrivers(data);
            } else {
                setError(data.message || 'Failed to fetch drivers.');
            }
        } catch (err) {
            console.error('Failed to fetch drivers:', err);
            setError('Server error fetching drivers.');
        }
    };

    const assignDriver = async (cabId, driverId) => {
        setMessage('');
        setError('');
        try {
            const res = await fetch('http://localhost:5000/api/admin/assign-driver', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ cabId, driverId }),
            });

            const data = await res.json();

            if (res.ok) {
                setMessage('Driver assigned successfully!');
                fetchCabRequests(); // Refresh list
            } else {
                setError(data.message || 'Failed to assign driver');
            }
        } catch (err) {
            console.error('Assign driver error:', err);
            setError('Server error during assignment');
        }
    };

    return (
        <div className="flex min-h-[calc(100vh-64px)] bg-gray-900 text-white p-6 justify-center">
            <div className="w-full max-w-4xl bg-gray-800 p-8 rounded-lg shadow-xl border border-blue-700">
                <h2 className="text-3xl font-bold text-blue-400 mb-6 text-center">Cab Requests Overview</h2>

                {loading && (
                    <div className="text-center text-blue-300">Loading cab requests and drivers...</div>
                )}

                {error && (
                    <div className="mb-4 p-3 bg-red-600 text-white rounded-md text-center">
                        {error}
                    </div>
                )}

                {message && (
                    <div className="mb-4 p-3 bg-green-600 text-white rounded-md text-center">
                        {message}
                    </div>
                )}

                {!loading && cabRequests.length === 0 ? (
                    <p className="text-center text-gray-400 text-lg">No cab requests available.</p>
                ) : (
                    !loading && (
                        <div className="space-y-6">
                            {cabRequests.map((req) => (
                                <div key={req._id} className="bg-gray-700 p-5 rounded-lg shadow-md border border-gray-600">
                                    <p className="text-lg font-semibold text-white">Pickup: <span className="font-normal">{req.pickupLocation}</span></p>
                                    <p className="text-lg font-semibold text-white">Drop: <span className="font-normal">{req.dropLocation}</span></p>
                                    <p className="text-lg font-semibold text-white">Time: <span className="font-normal">{new Date(req.pickupTime).toLocaleString()}</span></p>
                                    <p className="text-lg font-semibold text-white">Status: <span className={`font-normal px-2 py-1 rounded-md ${req.status === 'Pending' ? 'bg-yellow-500' : req.status === 'Accepted' ? 'bg-green-500' : 'bg-red-500'}`}>{req.status}</span></p>
                                    <p className="text-sm text-gray-400">Requested by: {req.requestedBy?.name || 'N/A'}</p>
                                    <div className="mt-4 flex items-center gap-4">
                                        <label htmlFor={`driver-select-${req._id}`} className="text-md text-gray-300">Assign to Driver:</label>
                                        <select
                                            id={`driver-select-${req._id}`}
                                            onChange={(e) => assignDriver(req._id, e.target.value)}
                                            className="block w-full md:w-1/2 px-3 py-2 bg-gray-900 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-white"
                                            defaultValue=""
                                        >
                                            <option value="" disabled>Select Driver</option>
                                            {drivers.map((driver) => (
                                                <option key={driver._id} value={driver._id}>
                                                    {driver.name} ({driver.email})
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )
                )}
            </div>
        </div>
    );
}

export default AdminCabOverview;