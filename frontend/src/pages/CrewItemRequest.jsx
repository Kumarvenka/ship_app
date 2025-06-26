import { useEffect, useState } from 'react';

function CrewItemRequest() {
  const [itemName, setItemName] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [portName, setPortName] = useState('');
  const [vendors, setVendors] = useState([]);
  const [selectedVendor, setSelectedVendor] = useState('');
  const [shipName, setShipName] = useState('');
  const [category, setCategory] = useState('');
  const [notes, setNotes] = useState('');
  const [eta, setEta] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchVendors = async () => {
      if (!portName) return;
      try {
        const res = await fetch(`http://localhost:5000/api/items/vendors/by-port/${portName}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (res.ok) {
          setVendors(data);
        } else {
          setMessage('❌ Could not fetch vendors for the entered port.');
        }
      } catch (err) {
        console.error('Error fetching vendors:', err);
        setMessage('❌ Network error fetching vendors.');
      }
    };

    fetchVendors();
  }, [portName, token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setIsLoading(true);

    if (!selectedVendor || !portName || !itemName || !shipName) {
      setMessage('❌ Please fill in all required fields.');
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch('http://localhost:5000/api/items/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          itemName,
          quantity,
          assignedVendor: selectedVendor,
          portName,
          shipName,
          category,
          notes,
          eta,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setMessage('✅ Request submitted successfully!');
        setItemName('');
        setQuantity(1);
        setSelectedVendor('');
        setPortName('');
        setShipName('');
        setCategory('');
        setNotes('');
        setEta('');
        setVendors([]);
      } else {
        setMessage(data.message || '❌ Submission failed.');
      }
    } catch (err) {
      console.error('Submit error:', err);
      setMessage('❌ Network error while submitting.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-screen flex items-center justify-center bg-gray-900 p-4">
      <div className="w-full max-w-lg bg-white rounded-lg shadow-xl p-8 border border-blue-200">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">📦 Request Item</h2>

        {message && (
          <div className={`p-3 rounded-md text-center mb-5 text-sm font-medium ${
            message.includes('✅') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
          }`}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-black">
          <div>
            <label className="block text-sm font-medium mb-1">Ship Name*</label>
            <input
              type="text"
              value={shipName}
              onChange={(e) => setShipName(e.target.value)}
              required
              placeholder="e.g., Marine Explorer"
              className="w-full px-4 py-2 border rounded-md bg-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Port Name*</label>
            <input
              type="text"
              value={portName}
              onChange={(e) => setPortName(e.target.value)}
              required
              placeholder="e.g., Vizag"
              className="w-full px-4 py-2 border rounded-md bg-white"
            />
          </div>

          {portName && (
            <div>
              <label className="block text-sm font-medium mb-1">Select Vendor*</label>
              <select
                value={selectedVendor}
                onChange={(e) => setSelectedVendor(e.target.value)}
                required
                className="w-full px-4 py-2 border rounded-md bg-white"
              >
                <option value="">-- Choose Vendor --</option>
                {vendors.map((v) => (
                  <option key={v._id} value={v._id}>
                    {v.name} ({v.email})
                  </option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium mb-1">Item Name*</label>
            <input
              type="text"
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
              required
              placeholder="e.g., First Aid Kit"
              className="w-full px-4 py-2 border rounded-md bg-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Quantity*</label>
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              required
              min="1"
              className="w-full px-4 py-2 border rounded-md bg-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Category</label>
            <input
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="e.g., Tools, Safety"
              className="w-full px-4 py-2 border rounded-md bg-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">ETA</label>
            <input
              type="text"
              value={eta}
              onChange={(e) => setEta(e.target.value)}
              placeholder="e.g., 25 June 2025"
              className="w-full px-4 py-2 border rounded-md bg-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Notes</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any additional info"
              rows="2"
              className="w-full px-4 py-2 border rounded-md bg-white"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-2 font-semibold rounded-md text-white ${
              isLoading ? 'bg-blue-300' : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {isLoading ? 'Submitting...' : '🚀 Submit Request'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default CrewItemRequest;
