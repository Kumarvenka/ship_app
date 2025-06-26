import { useEffect, useState } from 'react';

function CrewCabStatus() {
    const [cabRequests, setCabRequests] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCabRequests = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                setError('Authentication required. Please log in.');
                setLoading(false);
                return;
            }

            try {
                const res = await fetch('http://localhost:5000/api/cabs/crew/my-requests', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                const data = await res.json();
                if (res.ok) {
                    setCabRequests(data);
                } else {
                    setError(data.message || 'Failed to fetch your cab requests');
                }
            } catch (err) {
                setError('Server error. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchCabRequests();
    }, []);

    const getStatusBadge = (status) => {
        const base = 'inline-block px-3 py-1 rounded-full text-xs font-semibold shadow-sm border';
        if (status === 'Accepted') return `${base} bg-green-100 text-green-700 border-green-200`;
        if (status === 'Declined') return `${base} bg-red-100 text-red-700 border-red-200`;
        if (status === 'Confirmed') return `${base} bg-blue-100 text-blue-700 border-blue-200`;
        return `${base} bg-yellow-100 text-yellow-700 border-yellow-200`;
    };

    return (
        // Changed bg-gray-100 to bg-gray-900 or a suitable dark color
        <div className="min-h-screen bg-gray-900 font-sans">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <div className="bg-white border border-blue-200 shadow-xl rounded-lg overflow-hidden transform transition-all duration-300 hover:shadow-2xl">
                    <div className="px-6 py-5 border-b border-blue-100 bg-blue-50 flex items-center justify-between">
                        <h2 className="text-2xl font-extrabold text-blue-900 flex items-center gap-3">
                            <span className="text-blue-600 text-3xl">🚖</span> My Cab Requests
                        </h2>
                    </div>

                    {loading ? (
                        <div className="text-center p-8 text-gray-500 text-lg">Loading cab requests...</div>
                    ) : error ? (
                        <div className="m-6 p-4 bg-red-100 text-red-800 font-medium rounded-lg border border-red-300 shadow-sm flex items-center gap-2">
                            <span className="text-lg">⚠️</span> {error}
                        </div>
                    ) : cabRequests.length === 0 ? (
                        <p className="px-6 py-8 text-center text-gray-500 italic text-lg">
                            <span className="block mb-2">Looks like you haven't submitted any cab requests yet.</span>
                            <span className="text-blue-500 hover:underline cursor-pointer" onClick={() => window.location.href='/crew/request-cab'}>
                                Click here to request a cab!
                            </span>
                        </p>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full table-auto text-sm text-gray-700">
                                <thead className="bg-blue-100 text-blue-800 text-xs uppercase tracking-wider font-bold border-b border-blue-200">
                                    <tr>
                                        <th className="px-5 py-4 text-left">Port</th>
                                        <th className="px-5 py-4 text-left">Ship</th>
                                        <th className="px-5 py-4 text-left">Pickup</th>
                                        <th className="px-5 py-4 text-left">Drop</th>
                                        <th className="px-5 py-4 text-left">Time</th>
                                        <th className="px-5 py-4 text-left">Driver</th>
                                        <th className="px-5 py-4 text-left">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-blue-100">
                                    {cabRequests.map((cab) => (
                                        <tr
                                            key={cab._id}
                                            className="hover:bg-blue-50 transition-all duration-150 ease-in-out"
                                        >
                                            <td className="px-5 py-3 font-medium">{cab.portName}</td>
                                            <td className="px-5 py-3">{cab.shipName}</td>
                                            <td className="px-5 py-3">{cab.pickupLocation}</td>
                                            <td className="px-5 py-3">{cab.dropLocation}</td>
                                            <td className="px-5 py-3 whitespace-nowrap">{new Date(cab.pickupTime).toLocaleString()}</td>
                                            <td className="px-5 py-3 text-gray-600">{cab.assignedDriver?.name || '— N/A —'}</td>
                                            <td className="px-5 py-3">
                                                <span className={getStatusBadge(cab.status)}>{cab.status}</span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default CrewCabStatus;