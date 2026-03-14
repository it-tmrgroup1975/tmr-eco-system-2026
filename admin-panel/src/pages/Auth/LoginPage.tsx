import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { Label } from "../../components/ui/label";
import { Lock, User, Loader2, ShieldCheck } from "lucide-react";

import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios"; 
import { useAuthStore } from "../../store/authStore"; 
import { toast } from "sonner";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);

  const loginMutation = useMutation({
    mutationFn: async () => {
      const response = await api.post("/api/login/", {
        username,
        password,
      });
      return response.data;
    },
    onSuccess: (data) => {
      setAuth(data.user, data.access, data.refresh);
      toast.success("ยินดีต้อนรับเข้าสู่ระบบ");
      navigate("/dashboard");
    },
    onError: (error: any) => {
      const message = error.response?.data?.detail || "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง";
      toast.error(message);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      toast.error("กรุณากรอกข้อมูลให้ครบถ้วน");
      return;
    }
    loginMutation.mutate();
  };

  return (
    // Background: #F1F5F9 (Cool Grey) และ Typography: IBM Plex Sans Thai
    <div className="min-h-screen w-full flex items-center justify-center bg-[#F1F5F9] font-thai p-4 relative overflow-hidden">
      
      {/* Background Decor - การใช้ Sage Green (#4A7C59) และ Charcoal (#2D3748) แบบ Blur */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#4A7C59]/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#2D3748]/5 rounded-full blur-[120px]" />

      {/* Card: Glassmorphism (backdrop-blur-xl) และ Soft Double Shadows */}
      <Card className="w-full max-w-[450px] border-none bg-white/40 backdrop-blur-xl shadow-soft-double ring-1 ring-white/40 z-10">
        <CardHeader className="space-y-2 text-center pb-8">
          <div className="w-20 h-20 bg-[#4A7C59] rounded-3xl mx-auto flex items-center justify-center shadow-lg shadow-[#4A7C59]/30 mb-6 transition-transform hover:scale-105 duration-300">
            <ShieldCheck className="text-white w-10 h-10" />
          </div>
          <CardTitle className="text-4xl font-bold text-[#2D3748] tracking-tight">
            TMR 2026
          </CardTitle>
          <CardDescription className="text-[#2D3748]/60 text-base">
            จัดการทรัพยากรบุคคลด้วยระบบอัจฉริยะ
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-[#2D3748] font-semibold ml-1">ชื่อผู้ใช้งาน</Label>
              <div className="relative group">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-[#2D3748]/30 group-focus-within:text-[#4A7C59] transition-colors" />
                <Input 
                  id="username" 
                  placeholder="Employee ID or Email" 
                  className="h-12 pl-11 bg-white/50 border-white/20 shadow-sm focus:bg-white focus:border-[#4A7C59] focus:ring-[#4A7C59]/20 transition-all rounded-xl"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password" className="text-[#2D3748] font-semibold ml-1">รหัสผ่าน</Label>
              <div className="relative group">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-[#2D3748]/30 group-focus-within:text-[#4A7C59] transition-colors" />
                <Input 
                  id="password" 
                  type="password" 
                  placeholder="••••••••"
                  className="h-12 pl-11 bg-white/50 border-white/20 shadow-sm focus:bg-white focus:border-[#4A7C59] focus:ring-[#4A7C59]/20 transition-all rounded-xl"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <div className="pt-2">
              <Button 
                type="submit" 
                className="w-full bg-[#4A7C59] hover:bg-[#3d664a] text-white h-14 rounded-xl text-lg font-bold transition-all duration-300 shadow-lg shadow-[#4A7C59]/20 active:scale-[0.98]"
                disabled={loginMutation.isPending}
              >
                {loginMutation.isPending ? (
                  <Loader2 className="mr-2 h-6 w-6 animate-spin" />
                ) : (
                  "เข้าสู่ระบบ"
                )}
              </Button>
            </div>
            
            <p className="text-center text-sm text-[#2D3748]/40 pt-4">
              © 2026 TMR Eco System. All rights reserved.
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}