import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

const ProtectedRoute = () => {
  const { isAuthenticated } = useAuthStore();
  const token = localStorage.getItem('access_token');

  // ถ้าไม่มี Token หรือสถานะไม่ใช่ Authenticated ให้ไปหน้า Login
  if (!isAuthenticated || !token) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;