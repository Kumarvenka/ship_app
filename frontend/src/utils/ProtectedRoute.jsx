import { Navigate } from 'react-router-dom';

function ProtectedRoute({ children, allowedRoles }) {
  let user = null;
  const token = localStorage.getItem('token');

  try {
    const storedUser = localStorage.getItem('user');
    user = storedUser ? JSON.parse(storedUser) : null;
  } catch (err) {
    console.error("Failed to parse user from localStorage", err);
    user = null;
  }

  if (!token || !user) {
    return <Navigate to="/" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

export default ProtectedRoute;
