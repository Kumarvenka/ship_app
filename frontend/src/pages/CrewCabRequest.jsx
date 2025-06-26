import { useEffect, useState } from 'react';

function CrewCabRequest() {
    const [formData, setFormData] = useState({
        portName: '',
        shipName: '',
        contactNumber: '',
        pickupTime: '',
        pickupLocation: '',
        dropLocation: '',
        assignedDriver: '',
    });

    const [drivers, setDrivers] = useState([]);
    const [message, setMessage] = useState(''); // For success/error messages
    const [isLoading, setIsLoading] = useState(false); // For form submission
    const [isDriversLoading, setIsDriversLoading] = useState(false); // For fetching drivers
    const token = localStorage.getItem('token');

    // List of common port names for better UX on initial load/testing
    const commonPortNames = [
        'Singapore', 'Rotterdam', 'Shanghai', 'Ningbo-Zhoushan', 'Busan',
        'Hong Kong', 'Port of Los Angeles', 'Port of Long Beach', 'Hamburg',
        'Dubai (Jebel Ali)', 'Antwerp', 'Valencia', 'New York', 'Tokyo', 'Mumbai',
        'Vizag', 'Chennai', 'Kolkata' // Added some Indian ports
    ];

    useEffect(() => {
        const fetchDrivers = async () => {
            if (formData.portName) {
                setIsDriversLoading(true);
                setDrivers([]); // Clear previous drivers when port changes
                try {
                    const response = await fetch(`http://localhost:5000/api/cabs/drivers/by-port/${formData.portName}`, {
                        headers: { Authorization: `Bearer ${token}` },
                    });
                    const data = await response.json();
                    if (response.ok) {
                        setDrivers(data);
                    } else {
                        setMessage(data.message || 'Failed to load drivers for this port.');
                        setDrivers([]); // Ensure drivers are empty on error
                    }
                } catch (err) {
                    console.error('Error fetching drivers:', err);
                    setMessage('Failed to load drivers for this port due to network error. Please try again.');
                    setDrivers([]);
                } finally {
                    setIsDriversLoading(false);
                }
            } else {
                setDrivers([]);
                setFormData(prev => ({ ...prev, assignedDriver: '' })); // Clear assigned driver if port is empty
            }
        };

        const handler = setTimeout(() => {
            fetchDrivers();
        }, 500); // Debounce driver fetch by 500ms

        return () => clearTimeout(handler); // Cleanup on unmount or dependency change
    }, [formData.portName, token]);

    const handleChange = (e) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setIsLoading(true);

        try {
            const response = await fetch('http://localhost:5000/api/cabs/request', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();
            if (!response.ok) {
                setMessage(data.message || 'Cab request failed. Please check your details.');
                return;
            }

            setMessage('✅ Cab request submitted successfully! Awaiting driver confirmation.');
            setFormData({ // Reset form after success
                portName: '',
                shipName: '',
                contactNumber: '',
                pickupTime: '',
                pickupLocation: '',
                dropLocation: '',
                assignedDriver: '',
            });
            setDrivers([]); // Clear drivers as port name is reset
        } catch (err) {
            setMessage('❌ Network error or server is unreachable. Please try again.');
            console.error('Submission error:', err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-screen flex items-center justify-center bg-gray-900 p-4">
            <div className="w-full max-w-md bg-white rounded-lg shadow-2xl p-8 md:p-8 border border-blue-200">
                <h2 className="text-2xl font-bold text-center text-gray-800 mb-6 flex items-center justify-center space-x-2">
                    <span className="text-3xl text-blue-600">⚓</span>
                    <span>Cab Request Form</span>
                </h2>

                {message && (
                    <div className={`p-3 rounded-md text-center mb-5 text-sm font-medium ${
                        message.includes('success') ? 'bg-green-100 text-green-700 border border-green-300' : 'bg-red-100 text-red-700 border border-red-300'
                    } flex items-center justify-center gap-2`}>
                        {message}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    {[
                        { label: 'Port Name', name: 'portName', placeholder: 'e.g., Singapore', type: 'text', list: 'portNames' },
                        { label: 'Ship Name', name: 'shipName', placeholder: 'e.g., MV Atlantic Star' },
                        { label: 'Contact Number', name: 'contactNumber', type: 'tel', placeholder: 'e.g., +1234567890' },
                        { label: 'Pickup Time', name: 'pickupTime', type: 'datetime-local' },
                        { label: 'Pickup Location', name: 'pickupLocation', placeholder: 'e.g., Berth 10, Ship\'s Gangway' },
                        { label: 'Drop Location', name: 'dropLocation', placeholder: 'e.g., City Center, Airport' },
                    ].map(({ label, name, type = 'text', placeholder, list }) => (
                        <div key={name}>
                            <label htmlFor={name} className="block text-sm font-medium text-blue-700 mb-1.5">
                                {label}
                            </label>
                            <input
                                type={type}
                                id={name}
                                name={name}
                                value={formData[name]}
                                onChange={handleChange}
                                list={list}
                                placeholder={placeholder}
                                required
                                // MODIFIED LINE BELOW:
                                className={`w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-150
                                    ${type === 'datetime-local' ? 'text-red-900 bg-white' : 'text-gray-800 placeholder-gray-400'}`}
                            />
                            {name === 'portName' && (
                                <datalist id="portNames">
                                    {commonPortNames.map((port, index) => (
                                        <option key={index} value={port} />
                                    ))}
                                </datalist>
                            )}
                        </div>
                    ))}

                    {/* Assign Driver Select */}
                    <div>
                        <label htmlFor="assignedDriver" className="block text-sm font-medium text-gray-700 mb-1.5">
                            Assign Driver
                        </label>
                        <select
                            id="assignedDriver"
                            name="assignedDriver"
                            value={formData.assignedDriver}
                            onChange={handleChange}
                            required
                            disabled={!formData.portName || isDriversLoading}
                            className={`w-full px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-800 appearance-none pr-8
                                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-150
                                ${!formData.portName || isDriversLoading ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                        >
                            <option value="">
                                {isDriversLoading ? 'Loading drivers...' : (formData.portName ? '-- Select a Driver --' : '-- Enter Port Name First --')}
                            </option>
                            {drivers.length > 0 ? (
                                drivers.map(driver => (
                                    <option key={driver._id} value={driver._id}>
                                        {driver.name} ({driver.email})
                                    </option>
                                ))
                            ) : (
                                !isDriversLoading && formData.portName && <option value="" disabled>No drivers available for this port.</option>
                            )}
                        </select>
                        {isDriversLoading && (
                            <p className="text-blue-600 text-xs mt-2 flex items-center">
                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Fetching drivers...
                            </p>
                        )}
                        {!formData.portName && !isDriversLoading && (
                            <p className="text-gray-500 text-xs mt-2">Enter a port name above to see available drivers.</p>
                        )}
                    </div>

                    {/* Submit Button */}
                    <div className="pt-4">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`w-full flex items-center justify-center px-4 py-2.5 border border-transparent text-base font-semibold rounded-md shadow-sm
                                ${isLoading ? 'bg-blue-300 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'}
                                text-white transition duration-200 ease-in-out`}
                        >
                            {isLoading ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Submitting...
                                </>
                            ) : (
                                <>
                                    <span className="mr-2">🚀</span> Submit Request
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default CrewCabRequest;