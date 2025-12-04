// frontend/src/context/AuthContext.jsx
import React, { createContext, useReducer, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom'; // No longer needed for this file

const AuthContext = createContext();

// --- START MOCK DATA FOR BYPASS ---
// Define mock user profiles for testing
const MOCK_USERS = {
  member: { _id: 'mockMemberId', name: 'Test Member', email: 'member@test.com', role: 'member', token: 'mockTokenMember', membership: { status: 'active', endDate: new Date(Date.now() + 86400000).toISOString() } },
  trainer: { _id: 'mockTrainerId', name: 'Test Trainer', email: 'trainer@test.com', role: 'trainer', token: 'mockTokenTrainer' },
  admin: { _id: 'mockAdminId', name: 'Test Admin', email: 'admin@test.com', role: 'admin', token: 'mockTokenAdmin' },
};
// --- END MOCK DATA ---

// Initial state: Load user from localStorage if available
const initialState = {
  user: JSON.parse(localStorage.getItem('userInfo')) || null,
  loading: false,
  error: null,
};

// Reducer function (to manage state changes cleanly)
const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN_SUCCESS':
    case 'REGISTER_SUCCESS':
      // Store user in local storage and update state
      localStorage.setItem('userInfo', JSON.stringify(action.payload));
      return { ...state, user: action.payload, loading: false, error: null };
    case 'LOGOUT':
      // Remove user from local storage and clear state
      localStorage.removeItem('userInfo');
      return { ...state, user: null, loading: false, error: null };
    case 'SET_MOCK_USER': // NEW ACTION TYPE
        localStorage.setItem('userInfo', JSON.stringify(action.payload));
        return { ...state, user: action.payload, loading: false, error: null };
    default:
      return state;
  }
};

// Provider Component
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Simple login/logout functions (actual API calls will be in components)
  const logout = () => {
    dispatch({ type: 'LOGOUT' });
  };
  
  // --- NEW BYPASS EFFECT ---
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const testRole = params.get('testRole'); // Check for ?testRole=member/trainer/admin
    
    if (testRole && MOCK_USERS[testRole]) {
      const mockUser = MOCK_USERS[testRole];
      
      // Only set the mock user if we're not already logged in as that role
      if (!state.user || state.user.role !== testRole) {
          dispatch({ type: 'SET_MOCK_USER', payload: mockUser });
          // Optional: Clean up the URL query parameter after setting state
          // history.replaceState({}, document.title, window.location.pathname);
      }
    }
  }, [state.user, dispatch]);
  // --- END BYPASS EFFECT ---

  return (
    <AuthContext.Provider value={{ state, dispatch, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;