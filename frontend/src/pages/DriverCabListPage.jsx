import { useEffect, useState } from 'react';

function DriverCabListPage() { // This is the component being used as per App.js
    const [cabs, setCabs] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true); // Add loading state

    const token = localStorage.getItem('token');

    const fetchCabs = async () => {
        setLoading(true); // Set loading true when fetching starts
        setError(''); // Clear previous errors
        try {
            const res = await fetch('http://localhost:5000/api/cabs/driver/assigned', {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || 'Failed to fetch cabs');
            setCabs(data);
        } catch (err) {
            console.error("Error fetching driver's assigned cabs:", err);
            setError(err.message || 'Failed to fetch assigned cab requests.');
        } finally {
            setLoading(false); // Set loading false when fetching ends
        }
    };

    const updateStatus = async (id, action) => {
        if (!window.confirm(`Are you sure you want to ${action} this cab request?`)) {
            return; // User cancelled
        }
        try {
            const res = await fetch(`http://localhost:5000/api/cabs/${id}/${action}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
            });
            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.message || 'Failed to update status');
            }
            alert(`Cab request ${action === 'accept' ? 'accepted' : 'declined'} successfully!`);
            fetchCabs(); // Refresh after update
        } catch (err) {
            console.error(`Error updating status: ${err.message}`);
            alert(`Error: ${err.message}`);
        }
    };

    useEffect(() => {
        fetchCabs();
    }, []);

    return (
        <div className="min-h-screen w-screen flex items-center justify-center bg-gray-900 p-4">
            <div className="w-full max-w-4xl bg-white rounded-lg shadow-2xl p-8 md:p-10 border border-blue-200">
                <h2 className="text-3xl font-bold text-center text-gray-800 mb-8 flex items-center justify-center space-x-3">
                    <span className="text-4xl text-purple-600">🗺️</span>
                    <span>Assigned Cab Requests</span>
                </h2>

                {loading ? (
                    <div className="text-center text-gray-600 text-lg">Loading assigned cab requests...</div>
                ) : error ? (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6 text-center" role="alert">
                        <span className="block sm:inline">{error}</span>
                    </div>
                ) : cabs.length === 0 ? (
                    <div className="text-center text-gray-600 text-lg p-4 bg-gray-50 rounded-md border border-gray-200">
                        No cab requests assigned to you yet.
                    </div>
                ) : (
                    <div className="overflow-x-auto shadow-md rounded-lg border border-gray-200">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-blue-50">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Port
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Ship
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Pickup
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Drop
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Time
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {cabs.map((cab) => (
                                    <tr key={cab._id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                                            {cab.portName}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                                            {cab.shipName}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                                            {cab.pickupLocation}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                                            {cab.dropLocation}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                                            {new Date(cab.pickupTime).toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                                                ${cab.status === 'Accepted' ? 'bg-green-100 text-green-800' :
                                                  cab.status === 'Declined' ? 'bg-red-100 text-red-800' :
                                                  'bg-yellow-100 text-yellow-800'}`}>
                                                {cab.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            {cab.status === 'Requested' ? (
                                                <div className="flex space-x-2">
                                                    <button
                                                        onClick={() => updateStatus(cab._id, 'accept')}
                                                        className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                                                    >
                                                        Accept
                                                    </button>
                                                    <button
                                                        onClick={() => updateStatus(cab._id, 'decline')}
                                                        className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                                                    >
                                                        Decline
                                                    </button>
                                                </div>
                                            ) : (
                                                <span className="text-gray-500 italic">N/A</span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}

export default DriverCabListPage;