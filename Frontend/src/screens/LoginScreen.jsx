// frontend/src/screens/LoginScreen.jsx
import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { User, Dumbbell, ClipboardList, Settings } from 'lucide-react';

// MOCK USERS defined in AuthContext are reused here.
const MOCK_USERS = {
  member: { _id: 'mockMemberId', name: 'Test Member', email: 'member@test.com', role: 'member', token: 'mockTokenMember', membership: { status: 'active', endDate: new Date(Date.now() + 86400000).toISOString() } },
  trainer: { _id: 'mockTrainerId', name: 'Test Trainer', email: 'trainer@test.com', role: 'trainer', token: 'mockTokenTrainer' },
  admin: { _id: 'mockAdminId', name: 'Test Admin', email: 'admin@test.com', role: 'admin', token: 'mockTokenAdmin' },
};

const LoginScreen = () => {
  const { dispatch } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleRoleSelect = (role) => {
    const user = MOCK_USERS[role];
    if (user) {
      dispatch({ type: 'LOGIN_SUCCESS', payload: user }); // Use the success action to set state
      navigate('/dashboard');
    }
  };

  const MockCard = ({ role, title, icon: Icon, color }) => (
    <button
      onClick={() => handleRoleSelect(role)}
      className={`p-6 rounded-lg shadow-xl text-white ${color} hover:opacity-90 transition transform hover:scale-[1.02]`}
    >
      <Icon className="w-10 h-10 mx-auto mb-3" />
      <h2 className="text-xl font-bold">{title}</h2>
      <p className="text-sm opacity-80 mt-1">Access {role} features</p>
    </button>
  );

  return (
    <div className="flex flex-col items-center justify-center min-h-screen pt-6 sm:pt-0 bg-gray-50">
      <div className="w-full max-w-4xl">
        <h1 className="text-4xl font-extrabold text-gray-900 text-center mb-10">
          Gym Tracker Development Bypass 🚀
        </h1>
        <div className="grid grid-cols-3 gap-8 p-8 bg-white rounded-xl shadow-2xl">
          <MockCard 
            role="member" 
            title="Member App" 
            icon={Dumbbell} 
            color="bg-indigo-600"
          />
          <MockCard 
            role="trainer" 
            title="Trainer Portal" 
            icon={ClipboardList} 
            color="bg-teal-600"
          />
          <MockCard 
            role="admin" 
            title="Admin Dashboard" 
            icon={Settings} 
            color="bg-red-600"
          />
        </div>
        <p className="text-center text-sm text-gray-500 mt-6">
            Click a role above to instantly bypass authentication for development testing.
        </p>
      </div>
    </div>
  );
};

export default LoginScreen;