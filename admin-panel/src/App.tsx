import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "sonner"; // สำหรับแจ้งเตือน
import { ProtectedRoute } from "./components/shared/ProtectedRoute";
import LoginPage from "./pages/Auth/LoginPage";
import AppLayout from "./components/shared/AppLayout";
import DashboardPage from "./pages/Dashboard/Index";
import EmployeeListPage from "./pages/Employees/EmployeeListPage";
import PaySlipMail from "./pages/Payroll/PaySlipMail";
import { PaySlipDetail } from "./pages/Payroll/PaySlipDetail";

function App() {
  return (
    <BrowserRouter>
      {/* Toaster สำหรับแสดงการแจ้งเตือนสวยๆ */}
      <Toaster position="top-right" richColors />
      
      <Routes>
        {/* Public Route */}
        <Route path="/login" element={<LoginPage />} />

        {/* Protected Routes - ต้อง Login ก่อนถึงจะเข้าได้ */}
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<AppLayout />}>
            {/* หน้าต่างๆ ภายใต้ Layout */}
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="employees" element={<EmployeeListPage />} />
            <Route path="payroll" element={<PaySlipMail />} />
            <Route path="/payroll/detail/:id" element={<PaySlipDetail />} />
          </Route>
        </Route>

        {/* Fallback - ถ้าไม่เจอหน้าไหนเลยให้ไป Login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}


export default App;