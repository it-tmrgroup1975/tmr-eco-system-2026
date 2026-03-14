import { AlertTriangle, UserCircle, ClipboardCheck } from 'lucide-react';

const actions = [
  { label: 'ลางานออนไลน์', icon: ClipboardCheck, color: 'bg-blue-50 text-blue-600' },
  { label: 'แจ้งเหตุการณ์', icon: AlertTriangle, color: 'bg-red-50 text-red-600' },
  { label: 'ข้อมูลส่วนตัว', icon: UserCircle, color: 'bg-purple-50 text-purple-600' },
];

const QuickActions = () => {
  return (
    <div className="grid grid-cols-3 gap-3">
      {actions.map((action, index) => (
        <button
          key={index}
          className="flex flex-col items-center justify-center p-4 bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow border border-gray-100"
        >
          <div className={`p-3 rounded-xl mb-2 ${action.color}`}>
            <action.icon size={20} />
          </div>
          <span className="text-[11px] font-medium text-[#2D3748] text-center leading-tight">
            {action.label}
          </span>
        </button>
      ))}
    </div>
  );
};

export default QuickActions;