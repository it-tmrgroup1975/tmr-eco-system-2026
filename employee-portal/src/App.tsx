import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/Auth/LoginPage';
import Dashboard from './pages/Dashboard/Index';
import ProtectedRoute from './components/shared/ProtectedRoute';
import AppLayout from './components/shared/AppLayout';
import { MyPayslipDetailPage } from './pages/Payslip/MyPayslipDetail';
import { MyPayslipList } from './pages/Payslip/MyPayslipList';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Route */}
        <Route path="/login" element={<LoginPage />} />

        {/* Private Routes */}
        <Route element={<ProtectedRoute />}>
          {/* แก้ไข: ใช้ AppLayout เป็น Wrapper และไม่ต้องส่ง children เข้าไปใน Props */}
          <Route element={<AppLayout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/payslips" element={<MyPayslipList />} />
            <Route path="/dashboard/payslips/:id" element={<MyPayslipDetailPage />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;