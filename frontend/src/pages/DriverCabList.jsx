import { useEffect, useState } from 'react';

function DriverCabList() {
  const [cabRequests, setCabRequests] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCabRequests = async () => {
      const token = localStorage.getItem('token');

      try {
        const res = await fetch('http://localhost:5000/api/cabs/driver/assigned', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        if (res.ok) {
          setCabRequests(data);
        } else {
          setError(data.message || 'Failed to fetch cab requests');
        }
      } catch (err) {
        setError('Server error. Please try again later.');
      }
    };

    fetchCabRequests();
  }, []);

  return (
    <div className="min-h-screen bg-blue-50 flex items-center justify-center py-10 px-4">
      <div className="w-full max-w-md bg-white shadow-md rounded-xl p-6">
        <h2 className="text-xl font-bold text-center text-gray-800 mb-4">
          🚖 Assigned Cab Requests
        </h2>

        {error && (
          <div className="text-red-600 text-sm text-center mb-3">{error}</div>
        )}

        {cabRequests.length === 0 ? (
          <p className="text-center text-gray-600">No cab requests assigned yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-gray-700">
              <thead className="text-left text-gray-600 border-b">
                <tr>
                  <th className="py-2">Port</th>
                  <th className="py-2">Ship</th>
                  <th className="py-2">Pickup</th>
                  <th className="py-2">Drop</th>
                  <th className="py-2">Time</th>
                  <th className="py-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {cabRequests.map((req) => (
                  <tr key={req._id} className="border-b last:border-none">
                    <td className="py-1">{req.portName}</td>
                    <td className="py-1">{req.shipName}</td>
                    <td className="py-1">{req.pickupLocation}</td>
                    <td className="py-1">{req.dropLocation}</td>
                    <td className="py-1 whitespace-nowrap">
                      {new Date(req.pickupTime).toLocaleTimeString()}
                      <br />
                      {new Date(req.pickupTime).toLocaleDateString()}
                    </td>
                    <td className="py-1">{req.status}</td>
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

export default DriverCabList;
