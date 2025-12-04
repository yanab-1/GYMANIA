// frontend/src/components/QRCheckin.jsx
import React, { useState, useContext } from 'react';
import { QrCode, LogIn, XCircle } from 'lucide-react';
import AuthContext from '../context/AuthContext';
import API from '../api/axios';
import { useNavigate } from 'react-router-dom';

// In a real app, use a library like 'qrcode.react' 
// and the scanner app would decode the JWT and send it to the checkIn endpoint.
// Here, we simulate the action of the member's app sending the check-in request.

const QRCheckin = () => {
  const { state: { user } } = useContext(AuthContext);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Simple checker for visual feedback
  const isActive = user?.membership?.status === 'active' && new Date(user.membership.endDate) > new Date();

  const handleCheckin = async () => {
    setMessage(null);
    setError(null);

    try {
      const { data } = await API.post('/attendance/checkin', { scannerId: 'MAIN_DOOR_01' });

      setMessage(data.message);
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Check-in failed. Server error.';
      setError(errMsg);

      // Handle membership expired redirect
      if (err.response?.data?.redirect === '/purchase-plan') {
        setTimeout(() => navigate('/purchase-plan'), 3000);
      }
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-xl text-center">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">Gym Check-in</h2>

      <div className="relative inline-block mb-4">
         {/* Simulated QR Code Display */}
         <div className={`w-40 h-40 bg-gray-200 flex items-center justify-center rounded-lg border-4 ${isActive ? 'border-green-500' : 'border-red-500'}`}>
            <QrCode className="w-16 h-16 text-gray-500" />
         </div>
         {!isActive && (
            <div className="absolute inset-0 bg-red-500/80 flex items-center justify-center rounded-lg">
                <XCircle className="w-8 h-8 text-white mr-2" />
                <span className="text-white font-bold text-sm">EXPIRED</span>
            </div>
         )}
      </div>

      <p className="text-sm text-gray-600 mb-4">
         Scan this code at the gym entrance. (Simulated click below)
      </p>

      <button
        onClick={handleCheckin}
        disabled={!isActive}
        className={`w-full py-3 rounded-lg text-white font-bold transition duration-150 ${
          isActive 
            ? 'bg-indigo-600 hover:bg-indigo-700' 
            : 'bg-gray-400 cursor-not-allowed'
        }`}
      >
        <LogIn className="w-5 h-5 inline mr-2" />
        Simulate Check-in Now
      </button>

      {message && <p className="mt-3 text-green-600 font-medium">{message}</p>}
      {error && <p className="mt-3 text-red-600 font-medium">{error}</p>}

    </div>
  );
};

export default QRCheckin;