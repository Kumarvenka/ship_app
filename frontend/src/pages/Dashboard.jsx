import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) navigate('/');
  }, [navigate]);

  const user = JSON.parse(localStorage.getItem('user'));
  const role = user?.role;

  return (
    <div className="min-h-screen w-screen bg-gray-900 font-sans pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="bg-white shadow-xl rounded-lg p-8 border border-blue-200">
          <h2 className="text-3xl font-extrabold text-blue-900 mb-6 flex items-center gap-3">
            <span className="text-blue-600 text-4xl">👋</span> Welcome, {user?.name || 'User'}!
          </h2>
          <p className="text-lg text-gray-700 mb-8">
            Your Role: <span className="font-semibold text-blue-700">{role?.toUpperCase()}</span>
          </p>

          {role === 'crew' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Cab Request */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
                <h3 className="text-xl font-bold text-blue-800 mb-4 flex items-center gap-2">
                  <span className="text-blue-600 text-2xl">🚗</span> Cab Services
                </h3>
                <p className="text-gray-600 mb-5">Need a ride? Submit a new cab request.</p>
                <button
                  onClick={() => navigate('/crew/request-cab')}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-md"
                >
                  Request a Cab
                </button>
              </div>

              {/* View Cab Requests */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
                <h3 className="text-xl font-bold text-green-800 mb-4 flex items-center gap-2">
                  <span className="text-green-600 text-2xl">📋</span> View Cab Requests
                </h3>
                <p className="text-gray-600 mb-5">Check your submitted cab requests.</p>
                <button
                  onClick={() => navigate('/crew/cab-status')}
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-md"
                >
                  View My Cab Requests
                </button>
              </div>

              {/* Item Request */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
                <h3 className="text-xl font-bold text-yellow-800 mb-4 flex items-center gap-2">
                  <span className="text-yellow-600 text-2xl">📦</span> Item Requests
                </h3>
                <p className="text-gray-600 mb-5">Request new items for your crew or operations.</p>
                <button
                  onClick={() => navigate('/crew/request-item')}
                  className="w-full bg-yellow-600 hover:bg-yellow-700 text-white font-semibold py-3 rounded-md"
                >
                  Request an Item
                </button>
              </div>

              {/* View Item Status */}
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
                <h3 className="text-xl font-bold text-purple-800 mb-4 flex items-center gap-2">
                  <span className="text-purple-600 text-2xl">📊</span> Item Status
                </h3>
                <p className="text-gray-600 mb-5">Check the status of your item requests.</p>
                <button
                  onClick={() => navigate('/crew/item-status')}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 rounded-md"
                >
                  View Item Status
                </button>
              </div>
            </div>
          )}

          {/* ... rest unchanged ... */}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
