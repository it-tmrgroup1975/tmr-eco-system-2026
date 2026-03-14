import { CheckCircle2 } from 'lucide-react';
import AttendanceStatus from './components/AttendanceStatus';
import QuickActions from './components/QuickActions';
import RecentActivity from './components/RecentActivity';

const Dashboard = () => {
  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <section>
        <h1 className="text-xl font-bold text-[#2D3748]">สวัสดีตอนเช้า 👋</h1>
        <p className="text-sm text-gray-500">ยินดีต้อนรับกลับมา, คุณสมชาย มั่งมี</p>
      </section>

      {/* Main Widget */}
      <section>
        <AttendanceStatus />
      </section>

      {/* Quick Menu */}
      <section>
        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-widest mb-4">เมนูแนะนำ</h3>
        <QuickActions />
      </section>

      {/* ประวัติย่อ (Recent Activity) */}
      <RecentActivity />
    </div>
  );
};

export default Dashboard;