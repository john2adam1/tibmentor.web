'use client';

import { useEffect, useState, useRef } from 'react';
import { useAuth } from '@/lib/auth-context';
import Link from 'next/link';
import { activityService, profileService } from '@/services';
import { ActivityStatsResponse, TestHistoryRes } from '@/types/mobile-api';
import { Phone, BarChart3, Trash2, Camera, LogOut, MessageSquare, HelpCircle, FileText, ExternalLink, MessageCircle, ChevronRight, Crown, GraduationCap, PlayCircle, BookOpen } from 'lucide-react';
import { formatUntil, packageLabel } from '@/lib/premium';
import { useRouter } from 'next/navigation';
import Modal from '@/components/ui/Modal';

export default function ProfilePage() {
    const { user, logout, refreshUser } = useAuth();
    const router = useRouter();
    const [activityStats, setActivityStats] = useState<ActivityStatsResponse | null>(null);
    const [testHistory, setTestHistory] = useState<TestHistoryRes | null>(null);

    // UI State
    const [showPasswordForm, setShowPasswordForm] = useState(false);
    const [showEditProfileForm, setShowEditProfileForm] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [showGuideModal, setShowGuideModal] = useState(false);

    // Password Form State (Removed as per user request)

    // Edit Profile State
    const [editName, setEditName] = useState('');
    const [editPhone, setEditPhone] = useState('');
    const [editEmail, setEditEmail] = useState('');
    const [editImage, setEditImage] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Feedback
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchActivityStats();
        fetchTestHistory();
        if (user) {
            setEditName(user.name || '');
            setEditPhone(user.phone_number || '');
            setEditEmail(user.email || '');
        }
    }, [user]);

    // Reset form when modal opens
    useEffect(() => {
        if (showEditProfileForm && user) {
            setEditName(user.name || '');
            setEditPhone(user.phone_number || '');
            setEditEmail(user.email || '');
            setError('');
        }
    }, [showEditProfileForm, user]);

    const fetchActivityStats = async () => {
        try {
            const stats = await activityService.getStats({ type: 'year' });
            setActivityStats(stats);
        } catch (err) {
            console.error('Failed to fetch activity stats:', err);
        }
    };

    const fetchTestHistory = async () => {
        try {
            const history = await profileService.getTestHistory({ page: 1, limit: 10 });
            setTestHistory(history);
        } catch (err) {
            console.error('Failed to fetch test history:', err);
        }
    };

    // Password change functionality removed as per user request

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setMessage('');
        setLoading(true);

        try {
            const phoneToSend = editPhone.trim();
            const formattedPhone = phoneToSend ?
                (phoneToSend.startsWith('+') ? phoneToSend : `+${phoneToSend}`) :
                undefined;

            // Only send fields if they are not just '+' or empty
            const payload: any = {
                name: editName,
                image: editImage || undefined,
            };

            if (!user?.email && formattedPhone && formattedPhone.length > 5) {
                payload.phone_number = formattedPhone;
            }

            if (user?.email && editEmail && editEmail.includes('@')) {
                payload.email = editEmail;
            }

            await profileService.updateProfile(payload);

            await refreshUser();
            setMessage('Profil muvaffaqiyatli yangilandi');
            setShowEditProfileForm(false);
        } catch (err: any) {
            console.error('Profile update error:', err);
            const errorMsg = err.message || '';
            if (errorMsg.includes('duplicate key value violates unique constraint') || errorMsg.includes('phone_number_deleted_at_key')) {
                setError('Bu nomerda allaqachon akkount mavjud.');
            } else {
                setError(errorMsg || 'Profilni yangilashda xatolik yuz berdi');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteAccount = async () => {
        setLoading(true);
        try {
            await profileService.deleteProfile();
            logout();
        } catch (err: any) {
            setError(err.message || 'Hisobni o‘chirishda xatolik yuz berdi');
            setLoading(false);
            setShowDeleteConfirm(false);
        }
    };

    const formatTime = (seconds: number) => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        if (hours > 0) {
            return `${hours}s ${minutes}d`;
        }
        return `${minutes}d`;
    };

    return (
        <div className="max-w-7xl mx-auto p-6 lg:p-10">
            <h1 className="text-3xl font-black text-gray-900 mb-10 tracking-tight">Shaxsiy kabinet</h1>

            {error && (
                <div className="mb-8 p-5 bg-primary/5 border border-primary/10 rounded-2xl text-primary text-sm font-medium flex items-center gap-3">
                    <span className="text-xl">⚠️</span> {error}
                </div>
            )}
            {message && (
                <div className="mb-8 p-5 bg-emerald-50 border border-emerald-100/50 rounded-2xl text-emerald-600 text-sm font-medium flex items-center gap-3">
                    <span className="text-xl">✅</span> {message}
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Left Column: Avatar & Basic Info */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-soft text-center relative overflow-hidden group">
                        <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-r from-primary/10 to-primary/5 -mt-4"></div>

                        <div className="relative inline-block mt-4 mb-6">
                            <div className="w-32 h-32 rounded-[2.5rem] bg-white shadow-card flex items-center justify-center mx-auto overflow-hidden text-4xl font-black text-primary p-1 border-4 border-white">
                                <div className="w-full h-full rounded-[2.2rem] bg-primary-tint flex items-center justify-center overflow-hidden">
                                    {user?.image_url ? (
                                        <img src={user.image_url} alt={user.name} className="w-full h-full object-cover" />
                                    ) : (
                                        user?.name?.charAt(0) || 'U'
                                    )}
                                </div>
                            </div>
                            <button
                                onClick={() => fileInputRef.current?.click()}
                                className="absolute bottom-0 right-0 w-10 h-10 bg-white rounded-2xl shadow-lg border border-gray-100 flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all active:scale-90"
                            >
                                <Camera size={18} />
                            </button>
                        </div>

                        <h3 className="text-2xl font-black text-gray-900 mb-1">{user?.name}</h3>
                        {user?.is_ustoz && (
                            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest mb-3">
                                Ustoz
                            </span>
                        )}
                        <p className="text-gray-400 font-medium mb-8 flex flex-col items-center justify-center gap-1">
                            {!user?.email ? (
                                <span className="flex items-center gap-2"><Phone size={14} /> {user?.phone_number}</span>
                            ) : (
                                <span className="flex items-center gap-2 text-xs opacity-75">{user.email}</span>
                            )}
                        </p>


                        <div className="grid grid-cols-1 gap-3">
                            <button
                                onClick={() => {
                                    setError('');
                                    setShowEditProfileForm(true);
                                }}
                                className="w-full py-4 bg-primary text-white rounded-2xl font-bold shadow-lg shadow-primary/20 hover:bg-primary-600 transition-all active:scale-[0.98]"
                            >
                                Profilni tahrirlash
                            </button>
                            <button
                                onClick={logout}
                                className="w-full py-4 bg-slate-50 text-gray-400 rounded-2xl font-bold hover:bg-red-50 hover:text-red-500 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                            >
                                <LogOut size={18} /> Chiqish
                            </button>
                        </div>
                        <input
                            type="file"
                            accept="image/*"
                            ref={fileInputRef}
                            className="hidden"
                            onChange={(e) => {
                                if (e.target.files && e.target.files[0]) {
                                    setEditImage(e.target.files[0]);
                                }
                            }}
                        />
                    </div>

                    {/* Security section removed as password feature is gone */}
                </div>

                {/* Right Column: Dynamic Forms & Stats */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-soft">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-black text-gray-900 flex items-center gap-3">
                                <Crown className="text-primary" />
                                Premium
                            </h3>
                            {!user?.is_ustoz && (
                                <Link href="/premium" className="text-xs font-black uppercase tracking-widest text-primary">
                                    Premium olish
                                </Link>
                            )}
                        </div>
                        {user?.is_ustoz ? (
                            <p className="font-bold text-gray-700">Ustoz — doimiy kirish</p>
                        ) : user?.packages?.some((p) => p.is_active) ? (
                            <div className="space-y-3">
                                {user.packages.filter((p) => p.is_active).map((p) => (
                                    <div key={p.package} className="flex items-center justify-between p-4 rounded-2xl bg-slate-50">
                                        <div>
                                            <p className="font-black text-gray-900">Premium: {packageLabel(p.package)}</p>
                                            {p.until && (
                                                <p className="text-xs font-medium text-gray-400">{formatUntil(p.until)} gacha</p>
                                            )}
                                        </div>
                                        <Link href={`/premium?package=${p.package}`} className="text-xs font-black uppercase tracking-widest text-primary">
                                            Uzaytirish
                                        </Link>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="flex items-center justify-between">
                                <p className="font-bold text-gray-500">Premium yo‘q</p>
                                <Link href="/premium" className="px-5 py-3 bg-primary text-white rounded-xl text-xs font-black uppercase tracking-widest">
                                    Premium olish
                                </Link>
                            </div>
                        )}
                    </div>

                    <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-soft">
                        <h3 className="text-xl font-black text-gray-900 mb-2">
                            Test natijalari
                            {typeof user?.tests_count === 'number' && (
                                <span className="ml-2 text-primary/40">{user.tests_count}</span>
                            )}
                        </h3>
                        {testHistory?.summary && (
                            <p className="text-sm text-gray-400 font-medium mb-6">
                                O‘rtacha {Math.round(testHistory.summary.average_percent)}% · eng yaxshi {Math.round(testHistory.summary.best_percent)}%
                            </p>
                        )}
                        {testHistory?.data?.length ? (
                            <div className="space-y-3">
                                {testHistory.data.map((item) => (
                                    <button
                                        key={item.test_id}
                                        onClick={() => router.push(`/lessons/${item.lesson_id}/quiz/${item.test_id}?attempt=${item.last_attempt_id}`)}
                                        className="w-full text-left p-4 rounded-2xl bg-slate-50 hover:bg-primary/5 transition-colors"
                                    >
                                        <div className="flex items-center justify-between gap-4">
                                            <div className="min-w-0">
                                                <p className="font-black text-gray-900 truncate">{item.test_title}</p>
                                                <p className="text-xs text-gray-400 font-medium">
                                                    {item.course_name} · {formatUntil(item.last_finished_at)} · {item.attempts} urinish
                                                </p>
                                            </div>
                                            <span className="text-lg font-black text-primary">{Math.round(item.best_percent)}%</span>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        ) : (
                            <p className="text-sm text-gray-400 font-medium">Hali test ishlanmagan.</p>
                        )}
                    </div>

                    {/* Activity Stats */}
                    {activityStats && (
                        <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-soft">
                            <h3 className="text-xl font-black text-gray-900 mb-8 flex items-center gap-3">
                                <BarChart3 className="text-primary" />
                                Muvaffaqiyatlarim
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div className="p-8 bg-blue-50/50 rounded-[2rem] border border-blue-100 relative overflow-hidden group">
                                    <div className="absolute -right-4 -bottom-4 text-blue-100 group-hover:scale-110 transition-transform duration-500">
                                        <BarChart3 size={100} strokeWidth={1} />
                                    </div>
                                    <p className="text-[10px] text-blue-500 font-black uppercase tracking-widest mb-2">Jami ball</p>
                                    <p className="text-4xl font-black text-blue-900 mt-1">{activityStats.total} <span className="text-lg font-bold opacity-50">ball</span></p>
                                </div>
                                <div className="p-8 bg-emerald-50/50 rounded-[2rem] border border-emerald-100 relative overflow-hidden group">
                                    <div className="absolute -right-4 -bottom-4 text-emerald-100 group-hover:scale-110 transition-transform duration-500">
                                        <BarChart3 size={100} strokeWidth={1} />
                                    </div>
                                    <p className="text-[10px] text-emerald-500 font-black uppercase tracking-widest mb-2">O'qish vaqti</p>
                                    <p className="text-4xl font-black text-emerald-900 mt-1">{formatTime(activityStats.total)}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Yordam va Ma'lumotlar */}
                    <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-soft">
                        <h3 className="text-xl font-black text-gray-900 mb-8 flex items-center gap-3">
                            <HelpCircle className="text-primary" />
                            Yordam va ma'lumotlar
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <a
                                href="https://t.me/imedteam_feedback"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-6 bg-slate-50 hover:bg-primary/5 border border-slate-100 rounded-3xl transition-all group"
                            >
                                <div className="flex items-center justify-between mb-2">
                                    <div className="w-10 h-10 rounded-2xl bg-white flex items-center justify-center text-primary shadow-sm">
                                        <MessageSquare size={20} />
                                    </div>
                                    <ExternalLink size={16} className="text-gray-300 group-hover:text-primary transition-colors" />
                                </div>
                                <p className="font-black text-gray-900 leading-tight">Fikr bildirish</p>
                                <p className="text-gray-400 text-xs font-medium mt-1">Telegram orqali murojaat</p>
                            </a>

                            <a
                                href="https://t.me/manager_iMedteam"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-6 bg-slate-50 hover:bg-primary/5 border border-slate-100 rounded-3xl transition-all group"
                            >
                                <div className="flex items-center justify-between mb-2">
                                    <div className="w-10 h-10 rounded-2xl bg-white flex items-center justify-center text-primary shadow-sm">
                                        <MessageCircle size={20} />
                                    </div>
                                    <ExternalLink size={16} className="text-gray-300 group-hover:text-primary transition-colors" />
                                </div>
                                <p className="font-black text-gray-900 leading-tight">Admin bilan aloqa</p>
                                <p className="text-gray-400 text-xs font-medium mt-1">Savollar bo'yicha yozing</p>
                            </a>

                            <button
                                onClick={() => setShowGuideModal(true)}
                                className="p-6 bg-slate-50 hover:bg-primary/5 border border-slate-100 rounded-3xl transition-all group text-left"
                            >
                                <div className="flex items-center justify-between mb-2">
                                    <div className="w-10 h-10 rounded-2xl bg-white flex items-center justify-center text-primary shadow-sm">
                                        <HelpCircle size={20} />
                                    </div>
                                    <ChevronRight size={16} className="text-gray-300 group-hover:text-primary transition-colors" />
                                </div>
                                <p className="font-black text-gray-900 leading-tight">Qo'llanma</p>
                                <p className="text-gray-400 text-xs font-medium mt-1">Platformadan foydalanish</p>
                            </button>

                            <Link
                                href="/offerta"
                                className="p-6 bg-slate-50 hover:bg-primary/5 border border-slate-100 rounded-3xl transition-all group text-left"
                            >
                                <div className="flex items-center justify-between mb-2">
                                    <div className="w-10 h-10 rounded-2xl bg-white flex items-center justify-center text-primary shadow-sm">
                                        <FileText size={20} />
                                    </div>
                                    <ExternalLink size={16} className="text-gray-300 group-hover:text-primary transition-colors" />
                                </div>
                                <p className="font-black text-gray-900 leading-tight">Ommaviy oferta</p>
                                <p className="text-gray-400 text-xs font-medium mt-1">Shartnoma va qoidalar</p>
                            </Link>
                        </div>
                    </div>

                    {/* Danger Zone */}
                    <div className="bg-red-50/50 p-8 rounded-[2.5rem] border border-red-100">
                        <h3 className="text-xl font-black text-red-700 mb-2 flex items-center gap-2">
                            <Trash2 size={24} /> Xavfli hudud
                        </h3>
                        <p className="text-red-600 font-medium mb-8">Hisobingizni o'chirish qaytarib bo'lmas jarayon bo'lib, barcha ma'lumotlaringiz butunlay yo'qoladi.</p>

                        {!showDeleteConfirm ? (
                            <button
                                onClick={() => setShowDeleteConfirm(true)}
                                className="px-10 py-4 bg-white border-2 border-red-100 text-red-600 rounded-2xl font-bold hover:bg-red-600 hover:text-white hover:border-red-600 transition-all active:scale-[0.98] shadow-sm"
                            >
                                Hisobni o'chirish
                            </button>
                        ) : (
                            <div className="p-8 bg-white rounded-[2rem] border-2 border-red-100 shadow-xl relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-2 h-full bg-red-600"></div>
                                <p className="mb-8 text-gray-900 font-black text-lg leading-tight uppercase tracking-tight">Haqiqatan ham hisobingizni o'chirib yubormoqchimisiz?</p>
                                <div className="flex flex-col sm:flex-row gap-4">
                                    <button
                                        onClick={handleDeleteAccount}
                                        disabled={loading}
                                        className="px-10 py-4 bg-red-600 text-white rounded-2xl font-black shadow-lg shadow-red-600/20 hover:bg-red-700 transition-all active:scale-[0.98] disabled:opacity-50"
                                    >
                                        {loading ? 'O\'chirilmoqda...' : 'Ha, o\'chirilsin'}
                                    </button>
                                    <button
                                        onClick={() => setShowDeleteConfirm(false)}
                                        className="px-10 py-4 bg-slate-50 text-gray-500 rounded-2xl font-bold hover:bg-slate-100 transition-all active:scale-[0.98]"
                                    >
                                        Yo'q, qolsin
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Modals */}
            <Modal
                isOpen={showEditProfileForm}
                onClose={() => {
                    setShowEditProfileForm(false);
                    setError('');
                }}
                title="Profilni tahrirlash"
            >
                <div className="space-y-6">
                    {error && (
                        <div className="p-4 bg-red-50 border border-red-100 rounded-2xl text-red-600 text-sm font-medium flex items-center gap-3 animate-shake">
                            <span className="text-lg">⚠️</span> {error}
                        </div>
                    )}
                    <form onSubmit={handleUpdateProfile} className="space-y-6">
                        <div className="space-y-6">
                            <div>
                                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Ism familingiz</label>
                                <input
                                    type="text"
                                    value={editName}
                                    onChange={(e) => setEditName(e.target.value)}
                                    className="w-full px-6 py-4 rounded-2xl border-2 border-slate-100 focus:border-primary/20 focus:ring-4 focus:ring-primary/5 outline-none transition-all font-bold text-gray-700 hover:border-gray-200"
                                />
                            </div>

                            {!user?.email ? (
                                <div>
                                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Telefon raqam</label>
                                    <input
                                        type="tel"
                                        value={editPhone}
                                        readOnly
                                        maxLength={13}
                                        placeholder="+998901234567"
                                        onChange={(e) => {
                                            const val = e.target.value;
                                            if (val === '' || val === '+') {
                                                setEditPhone(val);
                                            } else {
                                                // Allow only + and digits
                                                const cleanVal = val.startsWith('+') ? '+' + val.slice(1).replace(/\D/g, '') : '+' + val.replace(/\D/g, '');
                                                setEditPhone(cleanVal.slice(0, 13));
                                            }
                                        }}
                                        className="w-full px-6 py-4 rounded-2xl border-2 border-slate-100 bg-slate-50 outline-none transition-all font-bold text-gray-400 cursor-not-allowed"
                                    />
                                </div>
                            ) : (
                                <div>
                                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Email manzil</label>
                                    <input
                                        type="email"
                                        value={editEmail}
                                        readOnly
                                        onChange={(e) => setEditEmail(e.target.value)}
                                        placeholder="example@mail.com"
                                        className="w-full px-6 py-4 rounded-2xl border-2 border-slate-100 bg-slate-50 outline-none transition-all font-bold text-gray-400 cursor-not-allowed"
                                    />
                                </div>
                            )}
                        </div>
                        <div className="flex gap-4 pt-4">
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex-1 py-4 bg-primary text-white rounded-2xl font-black shadow-lg shadow-primary/20 hover:bg-primary-600 transition-all active:scale-[0.98] disabled:opacity-50"
                            >
                                {loading ? 'Saqlanmoqda...' : 'Saqlash'}
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    setShowEditProfileForm(false);
                                    setError('');
                                }}
                                className="flex-1 py-4 bg-slate-50 text-gray-500 rounded-2xl font-bold hover:bg-slate-100 transition-all active:scale-[0.98]"
                            >
                                Bekor qilish
                            </button>
                        </div>
                    </form>
                </div>
            </Modal>

            {/* Password Modal Removed */}

            <Modal
                isOpen={showDeleteConfirm}
                onClose={() => setShowDeleteConfirm(false)}
                title="Hisobni o'chirish"
                className="max-w-md"
            >
                <div className="text-center space-y-6">
                    <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Trash2 size={40} />
                    </div>
                    <p className="text-gray-900 font-black text-xl leading-tight tracking-tight uppercase">
                        Haqiqatan ham hisobingizni o'chirib yubormoqchimisiz?
                    </p>
                    <p className="text-red-600 font-medium">
                        Bu qaytarib bo'lmas jarayon bo'lib, barcha ma'lumotlaringiz butunlay yo'qoladi.
                    </p>
                    <div className="flex flex-col gap-3 pt-4">
                        <button
                            onClick={handleDeleteAccount}
                            disabled={loading}
                            className="w-full py-4 bg-red-600 text-white rounded-2xl font-black shadow-lg shadow-red-600/20 hover:bg-red-700 transition-all active:scale-[0.98] disabled:opacity-50"
                        >
                            {loading ? 'O\'chirilmoqda...' : 'Ha, o\'chirilsin'}
                        </button>
                        <button
                            onClick={() => setShowDeleteConfirm(false)}
                            className="w-full py-4 bg-slate-50 text-gray-500 rounded-2xl font-bold hover:bg-slate-100 transition-all active:scale-[0.98]"
                        >
                            Yo'q, qolsin
                        </button>
                    </div>
                </div>
            </Modal>

            <Modal
                isOpen={showGuideModal}
                onClose={() => setShowGuideModal(false)}
                title="Platformadan foydalanish bo'yicha qo'llanma"
                className="max-w-2xl"
            >
                <div className="space-y-8 py-2">
                    <div className="relative pl-14 group">
                        <div className="absolute left-0 top-0 w-10 h-10 bg-primary/10 rounded-2xl flex items-center justify-center text-primary font-black">1</div>
                        <div className="absolute left-5 top-10 w-0.5 h-12 bg-slate-100"></div>
                        <h4 className="text-lg font-black text-gray-900 mb-2 flex items-center gap-2">
                            <GraduationCap size={20} className="text-primary" /> Kurslarni tanlash
                        </h4>
                        <p className="text-gray-500 font-medium leading-relaxed">
                            "Kurslar" bo'limiga o'ting va o'zingizga ma'qul bo'lgan mutaxassislik yoki fanni tanlang. Har bir kurs zamonaviy tibbiyot standartlari asosida tayyorlangan.
                        </p>
                    </div>

                    <div className="relative pl-14 group">
                        <div className="absolute left-0 top-0 w-10 h-10 bg-primary/10 rounded-2xl flex items-center justify-center text-primary font-black">2</div>
                        <div className="absolute left-5 top-10 w-0.5 h-12 bg-slate-100"></div>
                        <h4 className="text-lg font-black text-gray-900 mb-2 flex items-center gap-2">
                            <PlayCircle size={20} className="text-primary" /> Darslarni ko'rish
                        </h4>
                        <p className="text-gray-500 font-medium leading-relaxed">
                            Video darslarni istalgan qurilmada ko'rishingiz mumkin. Dars davomida kerakli materiallarni yuklab olish va saqlab qo'yish imkoniyati mavjud.
                        </p>
                    </div>

                    <div className="relative pl-14 group">
                        <div className="absolute left-0 top-0 w-10 h-10 bg-primary/10 rounded-2xl flex items-center justify-center text-primary font-black">3</div>
                        <h4 className="text-lg font-black text-gray-900 mb-2 flex items-center gap-2">
                            <BookOpen size={20} className="text-primary" /> Bilimlarni sinash
                        </h4>
                        <p className="text-gray-500 font-medium leading-relaxed">
                            Har bir mavzudan so'ng interaktiv testlarni topshirib, o'z bilimingizni tekshiring. Natijalaringiz shaxsiy kabinetda saqlanib boriladi.
                        </p>
                    </div>

                    <div className="pt-6 border-t border-slate-100 mt-8">
                        <button
                            onClick={() => setShowGuideModal(false)}
                            className="w-full py-4 bg-primary text-white rounded-2xl font-black shadow-lg shadow-primary/20 hover:bg-primary-600 transition-all active:scale-[0.98]"
                        >
                            Tushunarli, rahmat!
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
