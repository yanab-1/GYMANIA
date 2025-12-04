import React from 'react';
import MainLayout from '../components/MainLayout';

const AdminStaffScreen = () => {
  return (
    <MainLayout>
      <div className="p-8 bg-white rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold mb-4 text-red-600">👥 Admin Staff Management</h1>
        <p className="text-gray-600">
          This screen is for managing Trainer and Admin user accounts, roles, and profiles.
        </p>
        <div className="mt-4 p-4 border-l-4 border-yellow-500 bg-yellow-50 text-yellow-800">
          **TO DO:** Implement CRUD interface for managing staff accounts.
        </div>
      </div>
    </MainLayout>
  );
};

export default AdminStaffScreen;