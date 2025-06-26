import { Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Dashboard from './pages/Dashboard';
import Navbar from './components/Navbar';
import CrewCabRequestPage from './pages/CrewCabRequest';
import DriverCabListPage from './pages/DriverCabListPage';
import AdminCabOverviewPage from './pages/AdminCabOverview';
import CrewItemRequestPage from './pages/CrewItemRequest';
import VendorItemListPage from './pages/VendorItemList';
import AdminAssignVendorsPage from './pages/AdminAssignVendors';
import NotFound from './pages/NotFound';
import ProtectedRoute from './utils/ProtectedRoute';
import CrewCabStatus from './pages/CrewCabStatus'; // ✅ Import
import CrewItemStatus from './pages/CrewItemStatus'; 
import './index.css';

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Protected Routes */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        <Route path="/crew/request-cab" element={
          <ProtectedRoute allowedRoles={['crew']}>
            <CrewCabRequestPage />
          </ProtectedRoute>
        } />
        <Route path="/crew/cab-status" element={     // ✅ NEW route here
          <ProtectedRoute allowedRoles={['crew']}>
            <CrewCabStatus />
          </ProtectedRoute>
        } />
        <Route path="/crew/request-item" element={
          <ProtectedRoute allowedRoles={['crew']}>
            <CrewItemRequestPage />
          </ProtectedRoute>
        } />
        <Route path="/driver/assigned-cabs" element={
          <ProtectedRoute allowedRoles={['driver']}>
            <DriverCabListPage />
          </ProtectedRoute>
        } />
        <Route path="/vendor/assigned-items" element={
          <ProtectedRoute allowedRoles={['vendor']}>
            <VendorItemListPage />
          </ProtectedRoute>
        } />
        <Route path="/admin/cab-overview" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminCabOverviewPage />
          </ProtectedRoute>
        } />
        <Route path="/admin/assign-vendors" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminAssignVendorsPage />
          </ProtectedRoute>
        } />

        <Route path="/crew/item-status" element={
          <ProtectedRoute allowedRoles={['crew']}>
            <CrewItemStatus />
          </ProtectedRoute>
        } />

        {/* Catch-all Route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;
