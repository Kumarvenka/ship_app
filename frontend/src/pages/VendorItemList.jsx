import { useEffect, useState } from 'react';

function VendorItemList() {
  const [items, setItems] = useState([]);
  const [error, setError] = useState(null);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchAssignedItems = async () => {
      setError(null);
      try {
        const res = await fetch('http://localhost:5000/api/items/vendor/assigned', {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        const contentType = res.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          const text = await res.text();
          console.error('Expected JSON, got:', text);
          setError('Received non-JSON response from server.');
          return;
        }

        const data = await res.json();

        if (res.ok) {
          setItems(data);
        } else {
          setError(data.error || 'Failed to fetch assigned items.');
        }
      } catch (err) {
        console.error('Error fetching assigned items:', err);
        setError('An unexpected error occurred. Please try again later.');
      }
    };

    if (token) {
      fetchAssignedItems();
    } else {
      setError('Authentication token not found. Please log in.');
    }
  }, [token]);

  // ✅ Accept item
  const handleAccept = async (itemId) => {
    try {
      const res = await fetch(`http://localhost:5000/api/items/${itemId}/accept`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ accept: true }),
      });

      if (res.ok) {
        setItems(prev =>
          prev.map(item => item._id === itemId ? { ...item, status: 'Confirmed' } : item)
        );
      } else {
        const data = await res.json();
        alert(data.message || 'Failed to accept item.');
      }
    } catch (error) {
      console.error('Accept error:', error);
      alert('Error accepting item.');
    }
  };

  // ✅ Reject item
  const handleReject = async (itemId) => {
    try {
      const res = await fetch(`http://localhost:5000/api/items/${itemId}/accept`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ accept: false }),
      });

      if (res.ok) {
        setItems(prev =>
          prev.map(item => item._id === itemId ? { ...item, status: 'Rejected' } : item)
        );
      } else {
        const data = await res.json();
        alert(data.message || 'Failed to reject item.');
      }
    } catch (error) {
      console.error('Reject error:', error);
      alert('Error rejecting item.');
    }
  };

  // ✅ Optional: Mark delivered
  const handleDeliver = async (itemId) => {
    try {
      const res = await fetch(`http://localhost:5000/api/items/${itemId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: 'Delivered' }),
      });

      if (res.ok) {
        setItems(prev =>
          prev.map(item => item._id === itemId ? { ...item, status: 'Delivered' } : item)
        );
      } else {
        const data = await res.json();
        alert(data.message || 'Failed to mark delivered.');
      }
    } catch (err) {
      console.error('Delivery update error:', err);
      alert('Error marking item as delivered.');
    }
  };

  return (
    <div className="flex justify-center items-start min-h-screen py-8 px-4 sm:px-6 lg:px-8 bg-gray-900 text-white">
      <div className="bg-slate-800 p-6 rounded-lg shadow-xl w-full max-w-4xl border border-purple-700">
        <h2 className="text-3xl font-bold text-center text-purple-400 mb-8">Assigned Item Deliveries</h2>

        {error && (
          <div className="bg-red-500 text-white p-3 rounded-md mb-4 text-center">{error}</div>
        )}

        {items.length === 0 && !error ? (
          <p className="text-center text-lg text-gray-400 py-8">No items assigned yet.</p>
        ) : (
          <ul className="space-y-4">
            {items.map((item) => (
              <li
                key={item._id}
                className="bg-slate-700 p-4 rounded-md shadow-md border border-purple-600 hover:border-purple-400 transition duration-300"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-200">
                  <div>
                    <p><strong className="text-white">Item Name:</strong> {item.itemName}</p>
                    <p><strong className="text-white">Category:</strong> {item.category || 'N/A'}</p>
                    <p><strong className="text-white">Quantity:</strong> {item.quantity}</p>
                    <p><strong className="text-white">Notes:</strong> {item.notes || 'N/A'}</p>
                  </div>
                  <div>
                    <p><strong className="text-white">Ship Name:</strong> {item.shipName}</p>
                    <p><strong className="text-white">Port Name:</strong> {item.portName}</p>
                    <p><strong className="text-white">ETA:</strong> {item.eta ? new Date(item.eta).toLocaleDateString() : 'N/A'}</p>
                    <p>
                      <strong className="text-white">Status:</strong>{' '}
                      <span className={`font-semibold ${
                        item.status === 'Delivered' ? 'text-green-400' :
                        item.status === 'Confirmed' ? 'text-blue-400' :
                        item.status === 'Submitted' ? 'text-yellow-400' :
                        item.status === 'Rejected' ? 'text-red-400' :
                        'text-gray-400'
                      }`}>
                        {item.status}
                      </span>
                    </p>
                  </div>
                </div>

                {item.imageUrl && (
                  <div className="mt-4 flex justify-center">
                    <img
                      src={item.imageUrl}
                      alt={item.itemName}
                      className="max-h-32 rounded-md object-cover border border-gray-600"
                    />
                  </div>
                )}

                {/* Action Buttons */}
                <div className="mt-6 flex justify-end space-x-3">
                  {item.status === 'Submitted' && (
                    <>
                      <button
                        onClick={() => handleAccept(item._id)}
                        className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-md"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => handleReject(item._id)}
                        className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-md"
                      >
                        Reject
                      </button>
                    </>
                  )}
                  {item.status === 'Confirmed' && (
                    <button
                      onClick={() => handleDeliver(item._id)}
                      className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-md"
                    >
                      Mark Delivered
                    </button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default VendorItemList;
