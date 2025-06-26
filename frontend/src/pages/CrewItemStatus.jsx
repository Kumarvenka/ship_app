import { useEffect, useState } from 'react';

function CrewItemStatus() {
  const [requests, setRequests] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchItemRequests = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Please log in.');
        setLoading(false);
        return;
      }
      try {
        const res = await fetch('http://localhost:5000/api/items/crew/my-requests', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (res.ok) setRequests(data);
        else setError(data.message || 'Failed to fetch requests');
      } catch {
        setError('Server error. Please try later.');
      } finally {
        setLoading(false);
      }
    };

    fetchItemRequests();
  }, []);

  const getBadge = (status) => {
    const base = 'inline-block px-3 py-1 rounded-full text-xs font-semibold shadow-sm border';
    return (
      {
        Submitted: `${base} bg-yellow-100 text-yellow-800 border-yellow-200`,
        Confirmed: `${base} bg-blue-100 text-blue-700 border-blue-200`,
        Rejected: `${base} bg-red-100 text-red-700 border-red-200`,
        Delivered: `${base} bg-green-100 text-green-700 border-green-200`,
      }[status] || `${base} bg-gray-100 text-gray-800 border-gray-200}`
    );
  };

  return (
    <div className="min-h-screen bg-gray-900 font-sans">
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="bg-white border border-blue-200 shadow-xl rounded-lg overflow-hidden">
          <div className="px-6 py-5 bg-blue-50 border-b border-blue-100 flex items-center">
            <h2 className="text-2xl font-extrabold text-blue-900">📦 My Item Requests</h2>
          </div>

          {loading ? (
            <div className="p-8 text-center text-gray-500">Loading item requests...</div>
          ) : error ? (
            <div className="m-6 p-4 bg-red-100 text-red-800 rounded flex items-center gap-2">
              ⚠️ {error}
            </div>
          ) : requests.length === 0 ? (
            <p className="px-6 py-8 text-center text-gray-500 italic">
              You haven't submitted any item requests yet.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full table-auto text-sm text-gray-700">
                <thead className="bg-blue-100 text-blue-800 uppercase text-xs font-bold">
                  <tr>
                    <th className="px-5 py-4 text-left">Item</th>
                    <th className="px-5 py-4 text-left">Qty</th>
                    <th className="px-5 py-4 text-left">Port</th>
                    <th className="px-5 py-4 text-left">Vendor</th>
                    <th className="px-5 py-4 text-left">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-blue-100">
                  {requests.map((req) => (
                    <tr key={req._id} className="hover:bg-blue-50">
                      <td className="px-5 py-3">{req.itemName}</td>
                      <td className="px-5 py-3">{req.quantity}</td>
                      <td className="px-5 py-3">{req.portName}</td>
                      <td className="px-5 py-3">
                        {req.assignedVendor?.name || '— N/A —'}
                      </td>
                      <td className="px-5 py-3">
                        <span className={getBadge(req.status)}>{req.status}</span>
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

export default CrewItemStatus;
