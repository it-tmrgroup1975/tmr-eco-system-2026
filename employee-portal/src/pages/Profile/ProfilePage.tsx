import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userApi } from '../../api/userApi';
import { User, Phone, MapPin, Lock, Save, Loader2, Camera } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { toast } from 'sonner';

const ProfilePage = () => {
  const queryClient = useQueryClient();
  
  // ดึงข้อมูล Profile
  const { data: profile, isLoading } = useQuery({
    queryKey: ['profile'],
    queryFn: () => userApi.getProfile().then(res => res.data)
  });

  // Mutation สำหรับอัปเดตข้อมูล
  const updateMutation = useMutation({
    mutationFn: userApi.updateProfile,
    onSuccess: () => {
      toast.success("อัปเดตข้อมูลสำเร็จ");
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    }
  });

  if (isLoading) return <div className="flex justify-center p-10"><Loader2 className="animate-spin text-[#4A7C59]" /></div>;

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-10 font-['IBM_Plex_Sans_Thai']">
      <h1 className="text-2xl font-bold text-[#2D3748]">ข้อมูลส่วนตัว</h1>

      {/* Profile Header */}
      <div className="flex flex-col items-center py-6">
        <div className="relative">
          <div className="w-24 h-24 rounded-3xl bg-[#2D3748] flex items-center justify-center text-white text-3xl font-bold border-4 border-white shadow-xl">
            {profile?.first_name?.[0]}{profile?.last_name?.[0]}
          </div>
          <button className="absolute bottom-0 right-0 p-2 bg-[#4A7C59] text-white rounded-xl shadow-lg hover:scale-110 transition-transform">
            <Camera size={16} />
          </button>
        </div>
        <h2 className="mt-4 text-xl font-bold text-[#2D3748]">{profile?.first_name} {profile?.last_name}</h2>
        <p className="text-slate-500 text-sm">รหัสพนักงาน: {profile?.employee_id || 'TMR-001'}</p>
      </div>

      {/* ข้อมูลทั่วไป */}
      <Card className="border-none shadow-sm rounded-[2rem]">
        <CardHeader>
          <CardTitle className="text-sm font-bold flex items-center gap-2 text-[#4A7C59]">
            <User size={18} /> ข้อมูลทั่วไป
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>ชื่อ</Label>
              <Input defaultValue={profile?.first_name} className="rounded-xl border-slate-100 bg-slate-50/50" />
            </div>
            <div className="space-y-2">
              <Label>นามสกุล</Label>
              <Input defaultValue={profile?.last_name} className="rounded-xl border-slate-100 bg-slate-50/50" />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label className="flex items-center gap-2"><Phone size={14} /> เบอร์โทรศัพท์</Label>
            <Input defaultValue={profile?.phone} placeholder="08x-xxx-xxxx" className="rounded-xl border-slate-100 bg-slate-50/50" />
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-2"><MapPin size={14} /> ที่อยู่ปัจจุบัน</Label>
            <Input defaultValue={profile?.address} placeholder="บ้านเลขที่, ถนน, แขวง..." className="rounded-xl border-slate-100 bg-slate-50/50" />
          </div>

          <Button 
            onClick={() => updateMutation.mutate({})} // ใส่ข้อมูลที่ต้องการ update
            className="w-full bg-[#4A7C59] hover:bg-[#3d664a] rounded-xl h-12 font-bold transition-all"
          >
            {updateMutation.isPending ? <Loader2 className="animate-spin mr-2" /> : <Save className="mr-2" size={18} />}
            บันทึกข้อมูล
          </Button>
        </CardContent>
      </Card>

      {/* ความปลอดภัย */}
      <Card className="border-none shadow-sm rounded-[2rem]">
        <CardHeader>
          <CardTitle className="text-sm font-bold flex items-center gap-2 text-orange-600">
            <Lock size={18} /> ความปลอดภัย
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>รหัสผ่านปัจจุบัน</Label>
            <Input type="password" placeholder="••••••••" className="rounded-xl border-slate-100" />
          </div>
          <div className="space-y-2">
            <Label>รหัสผ่านใหม่</Label>
            <Input type="password" placeholder="••••••••" className="rounded-xl border-slate-100" />
          </div>
          <Button variant="outline" className="w-full border-slate-200 rounded-xl h-12 font-bold hover:bg-slate-50">
            เปลี่ยนรหัสผ่าน
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfilePage;