// frontend/src/screens/AdminEquipmentScreen.jsx
import React, { useState, useEffect } from 'react';
import MainLayout from '../components/MainLayout';
import API from '../api/axios';
import { Wrench, PlusCircle, Save, X } from 'lucide-react';

const AdminEquipmentScreen = () => {
    const [equipmentList, setEquipmentList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState(null);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({});

    const fetchEquipment = async () => {
        try {
            const { data } = await API.get('/api/equipment');
            setEquipmentList(data);
        } catch (err) {
            setMessage('Error fetching equipment list.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEquipment();
    }, []);

    const startEdit = (equipment) => {
        setEditingId(equipment._id);
        setFormData({
            status: equipment.status,
            notes: equipment.notes || '',
            lastMaintenanceDate: equipment.lastMaintenanceDate ? equipment.lastMaintenanceDate.substring(0, 10) : '',
        });
        setMessage(null);
    };

    const handleUpdate = async (id) => {
        try {
            const payload = {
                status: formData.status,
                notes: formData.notes,
                // Only send date if it's set
                lastMaintenanceDate: formData.lastMaintenanceDate || null, 
            };
            
            await API.put(`/api/equipment/${id}`, payload);
            setMessage(`✅ Equipment ID ${id} updated successfully!`);
            setEditingId(null);
            fetchEquipment(); // Refresh list
        } catch (err) {
            setMessage(`❌ Update failed: ${err.response?.data?.message || 'Server error'}`);
        }
    };

    const handleFormChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    if (loading) return <MainLayout><div className="text-center py-10">Loading Equipment Records...</div></MainLayout>;

    return (
        <MainLayout>
            <h1 className="text-3xl font-bold mb-6 flex items-center">⚙️ Equipment Maintenance Tracking</h1>
            <p className="mb-4 text-gray-600">Manage equipment status and maintenance history.</p>

            {message && <div className={`p-3 rounded mb-4 text-sm ${message.includes('✅') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{message}</div>}

            {/* Equipment List Table */}
            <div className="bg-white p-6 rounded-lg shadow-lg overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID / Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Service</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {equipmentList.map(item => (
                            <tr key={item._id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                    {item.name} <br />
                                    <span className="text-xs text-gray-500">({item.identifier})</span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.location}</td>
                                <td className={`px-6 py-4 whitespace-nowrap text-sm font-semibold ${item.status === 'Operational' ? 'text-green-600' : 'text-red-600'}`}>
                                    {item.status}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {item.lastMaintenanceDate ? new Date(item.lastMaintenanceDate).toLocaleDateString() : 'N/A'}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <button 
                                        onClick={() => startEdit(item)}
                                        className="text-indigo-600 hover:text-indigo-900 p-1 rounded-full hover:bg-indigo-50"
                                    >
                                        <Wrench className="w-5 h-5" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Edit Modal / Form (Simplified) */}
            {editingId && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-2xl w-full max-w-md">
                        <h2 className="text-xl font-bold mb-4">Update Equipment Status</h2>
                        <form onSubmit={(e) => { e.preventDefault(); handleUpdate(editingId); }}>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Status</label>
                                    <select name="status" value={formData.status} onChange={handleFormChange} className="mt-1 block w-full p-2 border rounded-md">
                                        <option value="Operational">Operational</option>
                                        <option value="Needs Repair">Needs Repair</option>
                                        <option value="Out of Service">Out of Service</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Last Maintenance Date</label>
                                    <input type="date" name="lastMaintenanceDate" value={formData.lastMaintenanceDate} onChange={handleFormChange} className="mt-1 block w-full p-2 border rounded-md" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Notes</label>
                                    <textarea name="notes" value={formData.notes} onChange={handleFormChange} rows="2" className="mt-1 block w-full p-2 border rounded-md" />
                                </div>
                            </div>
                            <div className="flex justify-end space-x-4 mt-6">
                                <button type="button" onClick={() => setEditingId(null)} className="flex items-center px-4 py-2 border rounded-md text-sm font-medium text-gray-700">
                                    <X className="w-4 h-4 mr-1" /> Cancel
                                </button>
                                <button type="submit" className="flex items-center px-4 py-2 border rounded-md text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700">
                                    <Save className="w-4 h-4 mr-1" /> Save Changes
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            
            {/* TO DO: Add form for creating new equipment item */}
        </MainLayout>
    );
};

export default AdminEquipmentScreen;