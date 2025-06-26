import { useEffect, useState } from 'react';

function AdminAssignVendors() {
    const [items, setItems] = useState([]);
    const [vendors, setVendors] = useState([]);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true); // New loading state
    const token = localStorage.getItem('token');

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError('');
            setMessage('');
            await Promise.all([fetchPendingItems(), fetchVendors()]);
            setLoading(false);
        };
        fetchData();
    }, []);

    const fetchPendingItems = async () => {
        try {
            const res = await fetch('http://localhost:5000/api/admin/item-requests', {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();
            if (res.ok) {
                setItems(data);
            } else {
                setError(data.message || 'Failed to fetch pending items.');
            }
        } catch (err) {
            console.error('Fetch pending items error:', err);
            setError('Server error fetching pending items.');
        }
    };

    const fetchVendors = async () => {
        try {
            const res = await fetch('http://localhost:5000/api/admin/vendors', {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();
            if (res.ok) {
                setVendors(data);
            } else {
                setError(data.message || 'Failed to fetch vendors.');
            }
        } catch (err) {
            console.error('Fetch vendors error:', err);
            setError('Server error fetching vendors.');
        }
    };

    const assignVendor = async (itemId, vendorId) => {
        setMessage('');
        setError('');
        try {
            const res = await fetch('http://localhost:5000/api/admin/assign-vendor', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ itemId, vendorId }),
            });

            const data = await res.json();
            if (res.ok) {
                setMessage('Vendor assigned successfully!');
                fetchPendingItems(); // Refresh list after assignment
            } else {
                setError(data.message || 'Error assigning vendor');
            }
        } catch (err) {
            console.error('Assign vendor error:', err);
            setError('Server error during assignment.');
        }
    };

    return (
        <div className="flex min-h-[calc(100vh-64px)] bg-gray-900 text-white p-6 justify-center">
            <div className="w-full max-w-4xl bg-gray-800 p-8 rounded-lg shadow-xl border border-blue-700">
                <h2 className="text-3xl font-bold text-blue-400 mb-6 text-center">Assign Vendors to Item Requests</h2>

                {loading && (
                    <div className="text-center text-blue-300">Loading item requests and vendors...</div>
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

                {!loading && items.length === 0 ? (
                    <p className="text-center text-gray-400 text-lg">No pending item requests.</p>
                ) : (
                    !loading && (
                        <div className="space-y-6">
                            {items.map((item) => (
                                <div key={item._id} className="bg-gray-700 p-5 rounded-lg shadow-md border border-gray-600">
                                    <p className="text-lg font-semibold text-white">Item: <span className="font-normal">{item.itemName}</span></p>
                                    <p className="text-lg font-semibold text-white">Quantity: <span className="font-normal">{item.quantity}</span></p>
                                    <p className="text-sm text-gray-400">Requested by: {item.requestedBy?.name || 'N/A'} at {new Date(item.requestDate).toLocaleString()}</p>
                                    <div className="mt-4 flex items-center gap-4">
                                        <label htmlFor={`vendor-select-${item._id}`} className="text-md text-gray-300">Select Vendor:</label>
                                        <select
                                            id={`vendor-select-${item._id}`}
                                            onChange={(e) => assignVendor(item._id, e.target.value)}
                                            className="block w-full md:w-1/2 px-3 py-2 bg-gray-900 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-white"
                                            defaultValue=""
                                        >
                                            <option value="" disabled>Select a vendor</option>
                                            {vendors.map((vendor) => (
                                                <option key={vendor._id} value={vendor._id}>
                                                    {vendor.name} ({vendor.email})
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

export default AdminAssignVendors;