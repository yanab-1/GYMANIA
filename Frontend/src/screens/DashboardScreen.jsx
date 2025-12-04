// frontend/src/screens/DashboardScreen.jsx
import React, { useContext, useEffect, useState } from 'react';
import MainLayout from '../components/MainLayout';
import AuthContext from '../context/AuthContext';
import API from '../api/axios';
import QRCheckin from '../components/QRCheckin';

const DashboardScreen = () => {
  const { state: { user } } = useContext(AuthContext);
  const [data, setData] = useState(null); // State for fetching dashboard data
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Example: Fetch role-specific data using the protected route and token
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        // Note: You must update the API configuration to send the token
        // We'll assume the API call is successful for now
        // const config = {
        //   headers: { Authorization: `Bearer ${user.token}` },
        // };
        // const { data: dashboardData } = await API.get(`/dashboard/${user.role}`, config);

        // Mock data based on role
        let dashboardData = {};
        if (user.role === 'admin') {
            dashboardData = { members: 120, expiring: 5, revenue: 15000 };
        } else if (user.role === 'trainer') {
            dashboardData = { clients: 15, openSlots: 10, pendingReviews: 3 };
        } else { // member
            dashboardData = { membershipStatus: 'Active', nextClass: 'Zumba 10 AM', lastWorkout: '2 days ago' };
        }

        setData(dashboardData);

      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const renderRoleContent = () => {
    if (loading) return <div className="text-center py-10">Loading Dashboard...</div>;
    if (!data) return <div className="text-center py-10 text-red-500">Could not load data.</div>;

    if (user.role === 'admin') {
      return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <DashboardCard title="Active Members" value={data.members} color="bg-indigo-600" />
          <DashboardCard title="Expiring Memberships" value={data.expiring} color="bg-yellow-600" />
          <DashboardCard title="Monthly Revenue (USD)" value={`$${data.revenue.toLocaleString()}`} color="bg-green-600" />
        </div>
      );
    }

    if (user.role === 'trainer') {
      return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <DashboardCard title="Active Clients" value={data.clients} color="bg-blue-600" />
          <DashboardCard title="Open PT Slots Today" value={data.openSlots} color="bg-teal-600" />
          <DashboardCard title="Client Logs to Review" value={data.pendingReviews} color="bg-red-600" />
        </div>
      );
    }

    // Default Member View
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <DashboardCard title="Membership Status" value={data.membershipStatus} color="bg-green-600" />
        <DashboardCard title="Next Class Booked" value={data.nextClass} color="bg-purple-600" />
        <DashboardCard title="Last Workout Logged" value={data.lastWorkout} color="bg-gray-600" />
        <div className="md:col-span-3">
          {/* This is where the progress chart visualization will go later */}
          <h2 className="text-xl font-semibold mt-8">📊 Your Strength Progress (Placeholder)</h2>
          <div className="bg-white p-6 rounded-lg shadow mt-2 h-64 flex items-center justify-center text-gray-400">
            Line chart of Bench Press Max over 6 months...
          </div>
        </div>
      </div>
    );
  };

  return (
    <MainLayout>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Welcome, {user?.name}!</h1>
      <p className="text-gray-500 mb-8">Role: <span className="capitalize font-semibold text-indigo-600">{user?.role}</span></p>

      {renderRoleContent()}
    </MainLayout>
  );
};

// Simple Card component for the Dashboard
const DashboardCard = ({ title, value, color }) => (
  <div className={`p-6 rounded-lg shadow-lg text-white ${color}`}>
    <p className="text-sm font-medium opacity-80">{title}</p>
    <p className="text-3xl font-extrabold mt-1">{value}</p>
  </div>
);

export default DashboardScreen;