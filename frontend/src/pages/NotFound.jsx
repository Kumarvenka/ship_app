import { Link } from 'react-router-dom';

function NotFound() {
  return (
    <div className="container">
      <h2>404 - Page Not Found</h2>
      <p>The page you are looking for doesn't exist.</p>
      <Link to="/dashboard" style={{ color: '#0077cc' }}>Go back to Dashboard</Link>
    </div>
  );
}

export default NotFound;
