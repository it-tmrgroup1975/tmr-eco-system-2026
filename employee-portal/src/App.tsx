import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/Auth/LoginPage';
import Dashboard from './pages/Dashboard/Index';
import ProtectedRoute from './components/shared/ProtectedRoute';
import AppLayout from './components/shared/AppLayout';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Route */}
        <Route path="/login" element={<LoginPage />} />

        {/* Private Routes (ต้อง Login ก่อน) */}
        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout children={<Dashboard />} />}>
            <Route path="/" element={<Dashboard />} />
            {/* เพิ่มหน้าอื่นๆ ของพนักงานที่นี่ เช่น /attendance, /payslips */}
          </Route>
        </Route>

        {/* Fallback: ถ้าไปมั่วๆ ให้กลับหน้าแรก */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;