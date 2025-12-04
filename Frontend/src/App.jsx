// frontend/src/App.jsx
import { Routes, Route, Navigate } from 'react-router-dom';
import { useContext } from 'react';
import AuthContext from './context/AuthContext';

// Screens
import LoginScreen from './screens/LoginScreen'; 
import RegisterScreen from './screens/RegisterScreen';
import DashboardScreen from './screens/DashboardScreen';
import PlanPurchaseScreen from './screens/PlanPurchaseScreen';
import WorkoutLoggerScreen from './screens/WorkoutLoggerScreen';
import ProgressTrackingScreen from './screens/ProgressTrackingScreen';
import ClientManagementScreen from './screens/ClientManagementScreen';

// NEW SCREEN IMPORTS:
import BookingScreen from './screens/BookingScreen';
import TrainerScheduleScreen from './screens/TrainerScheduleScreen';
import AdminStaffScreen from './screens/AdminStaffScreen';
import AdminEquipmentScreen from './screens/AdminEquipmentScreen';
import TrainerReviewScreen from './screens/TrainerReviewScreen'; // <-- ADDED IMPORT


// A wrapper to protect routes: redirects to /login if no user is present
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { state: { user } } = useContext(AuthContext);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <div className="text-center p-8 text-red-500">403 | Access Denied</div>;
  }

  return children;
};


function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<LoginScreen />} /> 
        <Route path="/register" element={<RegisterScreen />} />
        <Route path="/" element={<Navigate to="/dashboard" />} /> 

        {/* Protected Routes (Member, Trainer, Admin) */}
        <Route path="/dashboard" element={<ProtectedRoute><DashboardScreen /></ProtectedRoute>} />
        
        {/* 1. MEMBER Routes */}
        <Route path="/purchase-plan" element={<ProtectedRoute allowedRoles={['member']}><PlanPurchaseScreen /></ProtectedRoute>} />
        <Route path="/workouts" element={<ProtectedRoute allowedRoles={['member']}><WorkoutLoggerScreen /></ProtectedRoute>} />
        <Route path="/progress" element={<ProtectedRoute allowedRoles={['member']}><ProgressTrackingScreen /></ProtectedRoute>} />
        <Route path="/booking" element={<ProtectedRoute allowedRoles={['member']}><BookingScreen /></ProtectedRoute>} />
        
        {/* 2. TRAINER Routes (Client Management, Schedule, and REVIEW) */}
        <Route path="/trainer/clients" element={<ProtectedRoute allowedRoles={['trainer']}><ClientManagementScreen /></ProtectedRoute>} />
        <Route path="/trainer/schedule" element={<ProtectedRoute allowedRoles={['trainer']}><TrainerScheduleScreen /></ProtectedRoute>} />
        <Route 
            path="/trainer/review/:clientId" // <-- ADDED ROUTE
            element={<ProtectedRoute allowedRoles={['trainer']}><TrainerReviewScreen /></ProtectedRoute>} 
        />
        
        {/* 3. ADMIN Routes (Staff and Equipment) */}
        <Route path="/admin/staff" element={<ProtectedRoute allowedRoles={['admin']}><AdminStaffScreen /></ProtectedRoute>} />
        <Route path="/admin/equipment" element={<ProtectedRoute allowedRoles={['admin']}><AdminEquipmentScreen /></ProtectedRoute>} />
        
        <Route
          path="/admin/users"
          element={<ProtectedRoute allowedRoles={['admin']}><div>Admin User Management Page</div></ProtectedRoute>}
        />

        {/* Catch-all */}
        <Route path="*" element={<div className="text-center p-8">404 | Page Not Found</div>} />
      </Routes>
    </div>
  );
}

export default App;