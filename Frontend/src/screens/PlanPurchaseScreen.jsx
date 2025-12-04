// frontend/src/screens/PlanPurchaseScreen.jsx
import React, { useState, useEffect, useContext } from 'react';
import MainLayout from '../components/MainLayout';
import API from '../api/axios';
import AuthContext from '../context/AuthContext';

const PlanPurchaseScreen = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const { dispatch } = useContext(AuthContext); // To update local user state after purchase

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const { data } = await API.get('/plans');
        setPlans(data);
      } catch (err) {
        setMessage('Failed to load plans.');
      } finally {
        setLoading(false);
      }
    };
    fetchPlans();
  }, []);

  const handlePurchase = async (planId) => {
    setMessage('');
    if (!confirm("Simulate payment for this plan?")) return;

    try {
      // 1. Simulate Payment (Real app would integrate Stripe here)
      // ... API call to payment gateway ...

      // 2. Activate Membership on Backend
      const { data } = await API.post('/users/membership/purchase', { planId });

      setMessage(data.message);

      // Update the user context with new membership details
      const storedUser = JSON.parse(localStorage.getItem('userInfo'));
      const updatedUser = { ...storedUser, membership: data.membership };

      dispatch({ type: 'LOGIN_SUCCESS', payload: updatedUser }); // Reuses success type to update state

    } catch (err) {
      setMessage(err.response?.data?.message || 'Purchase failed.');
    }
  };

  if (loading) return <MainLayout><div className="text-center py-10">Loading Membership Plans...</div></MainLayout>;

  return (
    <MainLayout>
      <h1 className="text-3xl font-bold mb-8">Choose Your Membership Plan</h1>
      {message && <div className={`p-3 rounded mb-4 ${message.includes('success') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{message}</div>}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {plans.map((plan) => (
          <div key={plan._id} className="bg-white p-6 rounded-xl shadow-lg border-t-4 border-indigo-600 hover:shadow-xl transition duration-300">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h2>
            <p className="text-4xl font-extrabold text-indigo-600 mb-4">${plan.price} <span className="text-lg font-normal text-gray-500">/ {plan.durationDays} Days</span></p>
            <p className="text-gray-600 mb-6">{plan.description}</p>

            <button
              onClick={() => handlePurchase(plan._id)}
              className="w-full py-2 px-4 rounded-md text-white font-semibold bg-indigo-600 hover:bg-indigo-700 transition duration-150"
            >
              Purchase Now
            </button>
          </div>
        ))}
      </div>
    </MainLayout>
  );
};

export default PlanPurchaseScreen;