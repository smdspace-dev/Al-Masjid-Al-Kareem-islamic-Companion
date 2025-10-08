import React from 'react';
import { useAuth } from '../context/AuthContext';

const AdminBypass = () => {
  const { enableAdminAccess } = useAuth();

  const handleAdminBypass = () => {
    if (enableAdminAccess) {
      enableAdminAccess();
      window.location.href = '/admin';
    } else {
      // Fallback method
      localStorage.setItem('auth_token', 'admin_access_token');
      localStorage.setItem('user_data', JSON.stringify({
        id: 1,
        username: 'admin',
        email: 'admin@muslim-app.com',
        role: 'admin',
        is_active: true
      }));
      window.location.reload();
    }
  };

  return (
    <div className="fixed bottom-4 left-4 z-50">
      <button
        onClick={handleAdminBypass}
        className="px-4 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-colors shadow-lg"
        title="Admin Bypass for Testing"
      >
        🔑 Admin Access
      </button>
    </div>
  );
};

export default AdminBypass;
