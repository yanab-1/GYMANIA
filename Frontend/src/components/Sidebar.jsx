// frontend/src/components/Sidebar.jsx
import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { BarChart, Dumbbell, User, Clock, Settings, LogOut } from 'lucide-react'; // Example icons

const Sidebar = () => {
  const { state: { user }, logout } = useContext(AuthContext);

  // Define navigation links based on user role
  const getNavLinks = (role) => {
    const links = [
      { name: 'Dashboard', path: '/dashboard', icon: BarChart, roles: ['member', 'trainer', 'admin'] },
      { name: 'My Workouts', path: '/workouts', icon: Dumbbell, roles: ['member'] },
      { name: 'Progress Tracking', path: '/progress', icon: BarChart, roles: ['member'] },
      { name: 'Book Session', path: '/booking', icon: Clock, roles: ['member'] },
      { name: 'Client Management', path: '/trainer/clients', icon: User, roles: ['trainer'] },
      { name: 'Trainer Schedule', path: '/trainer/schedule', icon: Clock, roles: ['trainer'] },
      { name: 'Admin Staff Mgmt', path: '/admin/staff', icon: User, roles: ['admin'] },
      { name: 'Equipment Status', path: '/admin/equipment', icon: Settings, roles: ['admin'] },
    ];
    // Filter links based on the user's role
    return links.filter(link => link.roles.includes(role));
  };

  const navLinks = user ? getNavLinks(user.role) : [];

  return (
    <div className="flex flex-col w-64 bg-gray-800 text-white min-h-screen">
      <div className="flex items-center justify-center h-20 border-b border-gray-700">
        <span className="text-2xl font-bold tracking-wider">💪 Gym Tracker</span>
      </div>

      <nav className="flex-1 px-2 py-4 space-y-2">
        {navLinks.map((link) => (
          <Link
            key={link.path}
            to={link.path}
            className="flex items-center px-4 py-2 text-sm font-medium rounded-md hover:bg-gray-700 transition duration-150"
          >
            <link.icon className="h-5 w-5 mr-3" />
            {link.name}
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-700">
        <button
          onClick={logout}
          className="w-full flex items-center justify-center py-2 px-4 text-sm font-medium rounded-md text-red-400 bg-gray-700 hover:bg-gray-600 transition duration-150"
        >
          <LogOut className="h-4 w-4 mr-2" />
          Logout ({user?.role})
        </button>
      </div>
    </div>
  );
};

export default Sidebar;