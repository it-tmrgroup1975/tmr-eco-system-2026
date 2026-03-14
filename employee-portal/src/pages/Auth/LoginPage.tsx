import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LogIn, Mail, Lock, Eye, EyeOff, Loader2 } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import api from '../../api/axios';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { toast } from 'sonner';
const LoginPage = () => {
    const navigate = useNavigate();
    const { setAuth } = useAuthStore();

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const response = await api.post('http://localhost:8000/api/login/', {
                username,
                password
            });
            const { access, refresh, user } = response.data;

            // บันทึกสถานะลง Store
            setAuth(user, access, refresh);

            toast.success(`ยินดีต้อนรับคุณ ${user.first_name}`);
            navigate('/');
        } catch (error: any) {
            toast.error(error.response?.data?.detail || "อีเมลหรือรหัสผ่านไม่ถูกต้อง");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col justify-center items-center bg-[#F1F5F9] font-['IBM_Plex_Sans_Thai'] p-6">
            {/* Background Decor (แก้วมัลติเลเยอร์) */}
            <div className="fixed top-[-10%] right-[-10%] w-64 h-64 bg-[#4A7C59]/10 rounded-full blur-3xl animate-pulse" />
            <div className="fixed bottom-[-10%] left-[-10%] w-80 h-80 bg-[#2D3748]/5 rounded-full blur-3xl" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="w-full max-w-md z-10"
            >
                {/* Logo Section */}
                <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-[#2D3748] mb-6 shadow-2xl shadow-slate-900/20 rotate-3 transform transition-transform hover:rotate-0">
                        <span className="text-[#4A7C59] font-bold text-3xl italic">TMR</span>
                    </div>
                    <h1 className="text-3xl font-bold text-[#2D3748] tracking-tight">Employee Portal</h1>
                    <p className="text-slate-500 mt-2 font-medium">เข้าสู่ระบบเพื่อจัดการเวลาทำงานของคุณ</p>
                </div>

                {/* Login Card (Glassmorphism) */}
                <div className="bg-white/80 backdrop-blur-xl rounded-[2.5rem] p-8 shadow-2xl shadow-slate-200/50 border border-white">
                    <form onSubmit={handleLogin} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-xs uppercase tracking-widest text-slate-400 font-bold ml-1">Email Address</Label>
                            <div className="relative group">
                                <Mail className="absolute left-4 top-3 text-slate-300 group-focus-within:text-[#4A7C59] transition-colors" size={20} />
                                <Input
                                    id="email"
                                    type="text"
                                    placeholder="name@company.com"
                                    className="pl-12 h-14 bg-slate-50/50 border-slate-100 rounded-2xl focus:ring-[#4A7C59] focus:border-[#4A7C59] transition-all text-lg"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between items-center px-1">
                                <Label htmlFor="password" className="text-xs uppercase tracking-widest text-slate-400 font-bold">Password</Label>
                                <button type="button" className="text-xs font-semibold text-[#4A7C59] hover:underline">ลืมรหัสผ่าน?</button>
                            </div>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-3 text-slate-300 group-focus-within:text-[#4A7C59] transition-colors" size={20} />
                                <Input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    className="pl-12 h-14 bg-slate-50/50 border-slate-100 rounded-2xl focus:ring-[#4A7C59] focus:border-[#4A7C59] transition-all text-lg"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-3.5 text-slate-400 hover:text-slate-600 transition-colors"
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                        </div>

                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="w-full h-14 bg-[#2D3748] hover:bg-[#1a202c] text-white rounded-2xl text-lg font-bold shadow-xl shadow-slate-900/10 transition-all hover:scale-[1.02] active:scale-[0.98]"
                        >
                            {isLoading ? (
                                <div className="flex items-center gap-2">
                                    <Loader2 className="animate-spin" size={20} />
                                    <span>กำลังตรวจสอบ...</span>
                                </div>
                            ) : (
                                <div className="flex items-center gap-2">
                                    <span>เข้าสู่ระบบ</span>
                                    <LogIn size={20} />
                                </div>
                            )}
                        </Button>
                    </form>
                </div>

                {/* Footer Support */}
                <p className="text-center text-slate-400 text-sm mt-8">
                    มีปัญหาการใช้งาน? <a href="#" className="text-[#4A7C59] font-bold">ติดต่อฝ่าย IT</a>
                </p>
            </motion.div>
        </div>
    );
};

export default LoginPage;