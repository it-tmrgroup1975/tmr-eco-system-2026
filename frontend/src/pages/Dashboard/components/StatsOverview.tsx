// src/pages/Dashboard/components/StatsOverview.tsx
import { Users, UserCheck, UserMinus, TrendingUp } from "lucide-react";

const stats = [
  { label: "พนักงานทั้งหมด", value: "128", icon: Users, color: "text-charcoal" },
  { label: "มาทำงานวันนี้", value: "122", icon: UserCheck, color: "text-sage" },
  { label: "ลา/สาย", value: "6", icon: UserMinus, color: "text-red-500" },
  { label: "ประสิทธิภาพรวม", value: "98%", icon: TrendingUp, color: "text-sage" },
];

export function StatsOverview() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <div key={index} className="bg-white/60 backdrop-blur-xl p-6 rounded-2xl shadow-soft-double border border-white/20 hover:scale-[1.02] transition-transform duration-300">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-charcoal/60 font-medium">{stat.label}</p>
              <h3 className={`text-2xl font-bold mt-1 ${stat.color}`}>{stat.value}</h3>
            </div>
            <div className={`p-3 rounded-xl bg-background shadow-inner`}>
              <stat.icon size={20} className={stat.color} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}