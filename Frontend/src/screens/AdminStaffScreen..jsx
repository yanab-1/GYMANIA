// frontend/src/screens/AdminStaffScreen.jsx
import React, { useState, useEffect } from 'react';
import MainLayout from '../components/MainLayout';
import API from '../api/axios';
import { User, Edit, Save, RefreshCw } from 'lucide-react';

const AdminStaffScreen = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editingUserId, setEditingUserId] = useState(null);
    const [newRole, setNewRole] = useState('');
    const [message, setMessage] = useState(null);

    const fetchUsers = async () => {
        try {
            // Re-use the /users/members endpoint for all non-admin users, or create a new /users/all endpoint
            // For simplicity, let's fetch all users, including those with membership data (Admin view)
            const { data } = await API.get('/users/members'); 
            
            // In a real scenario, you'd fetch ALL users via an Admin-specific route, 
            // but for now, we'll display all members plus the logged-in admin.
            setUsers(data); 
            setError(null);
        } catch (err) {
            setError('Failed to fetch user list. Ensure API is running.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);
    
    const handleRoleUpdate = async (userId) => {
        if (!newRole) return;
        
        try {
            const { data } = await API.put(`/users/staff/${userId}`, { role: newRole });
            setMessage(`✅ ${data.message}`);
            // Refresh list and reset state
            fetchUsers();
            setEditingUserId(null);
            setNewRole('');
        } catch (err) {
            setMessage(`❌ Failed to update role: ${err.response?.data?.message || 'Server error'}`);
        }
    };

    if (loading) return <MainLayout><div className="text-center py-10">Loading Staff Data...</div></MainLayout>;
    if (error) return <MainLayout><div className="text-center py-10 text-red-500">{error}</div></MainLayout>;

    return (
        <MainLayout>
            <h1 className="text-3xl font-bold mb-6 flex items-center">👥 Admin Staff Management</h1>
            <p className="mb-4 text-gray-600">Manage Trainer and Member roles.</p>
            
            <button onClick={fetchUsers} className="flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-800 mb-4 p-2 bg-indigo-100 rounded">
                <RefreshCw className="w-4 h-4 mr-1" /> Refresh Data
            </button>
            
            {message && <div className={`p-3 rounded mb-4 text-sm ${message.includes('✅') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{message}</div>}

            <div className="bg-white p-6 rounded-lg shadow-lg overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Current Role</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Membership Status</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {users.map(user => (
                            <tr key={user._id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.name}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold capitalize">{user.role}</td>
                                <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium capitalize ${user.membership.status === 'active' ? 'text-green-600' : 'text-red-600'}`}>
                                    {user.membership.status}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    {editingUserId === user._id ? (
                                        <div className="flex items-center space-x-2">
                                            <select
                                                value={newRole}
                                                onChange={(e) => setNewRole(e.target.value)}
                                                className="p-1 border rounded-md text-gray-700"
                                            >
                                                <option value="member">Member</option>
                                                <option value="trainer">Trainer</option>
                                                <option value="admin">Admin</option>
                                            </select>
                                            <button 
                                                onClick={() => handleRoleUpdate(user._id)}
                                                className="text-indigo-600 hover:text-indigo-900 p-1 rounded-full hover:bg-indigo-50"
                                            >
                                                <Save className="w-5 h-5" />
                                            </button>
                                            <button 
                                                onClick={() => setEditingUserId(null)}
                                                className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-50"
                                            >
                                                X
                                            </button>
                                        </div>
                                    ) : (
                                        <button 
                                            onClick={() => { setEditingUserId(user._id); setNewRole(user.role); }}
                                            className="text-teal-600 hover:text-teal-900 p-1 rounded-full hover:bg-teal-50"
                                        >
                                            <Edit className="w-5 h-5" />
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </MainLayout>
    );
};

export default AdminStaffScreen;