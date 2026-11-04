'use client';

import { useEffect, useState, useRef } from 'react';
import { useAuth } from '@/lib/auth-context';
import Link from 'next/link';
import { activityService, profileService } from '@/services';
import { ActivityStatsResponse, TestHistoryRes } from '@/types/mobile-api';
import { Trash2, Camera, LogOut, MessageSquare, HelpCircle, FileText, ExternalLink, MessageCircle, ChevronRight, Crown, GraduationCap, PlayCircle, BookOpen, CheckCircle2 } from 'lucide-react';
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
    const [showTestHistory, setShowTestHistory] = useState(false);

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

    const activePackages = (user?.packages || []).filter((p) => p.is_active);

    const tile = 'w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0';
    const rowCls = 'w-full flex items-center gap-3 px-4 py-3.5 text-left hover:bg-slate-50 active:bg-slate-100 transition-colors';

    return (
        <div className="max-w-5xl mx-auto">
            <h1 className="text-xl md:text-3xl font-black text-slate-900 tracking-tight text-center md:text-left mb-5">Profil</h1>

            {error && (
                <div className="mb-4 p-4 bg-red-50 border border-red-100 rounded-2xl text-red-600 text-sm font-medium">{error}</div>
            )}
            {message && (
                <div className="mb-4 p-4 bg-emerald-50 border border-emerald-100 rounded-2xl text-emerald-700 text-sm font-medium">{message}</div>
            )}

            <div className="grid lg:grid-cols-2 gap-5 items-start">
                {/* Column 1: user, premium, tests */}
                <div className="space-y-4">
                    {/* User card */}
                    <div className="bg-white rounded-3xl border border-slate-100 shadow-soft p-4 flex items-center gap-4">
                        <div className="relative shrink-0">
                            <div className="w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center overflow-hidden text-2xl font-black">
                                {user?.image_url ? (
                                    <img src={user.image_url} alt={user.name} className="w-full h-full object-cover" />
                                ) : (
                                    (user?.name?.charAt(0) || 'U').toUpperCase()
                                )}
                            </div>
                            <button
                                onClick={() => fileInputRef.current?.click()}
                                aria-label="Rasm tanlash"
                                className="absolute -bottom-1 -right-1 w-7 h-7 bg-white rounded-full shadow border border-slate-100 flex items-center justify-center text-primary active:scale-90"
                            >
                                <Camera size={14} />
                            </button>
                            <input
                                type="file"
                                accept="image/*"
                                ref={fileInputRef}
                                className="hidden"
                                onChange={(e) => {
                                    if (e.target.files && e.target.files[0]) {
                                        setEditImage(e.target.files[0]);
                                        setError('');
                                        setShowEditProfileForm(true);
                                    }
                                }}
                            />
                        </div>
                        <button
                            className="min-w-0 flex-1 text-left"
                            onClick={() => {
                                setError('');
                                setShowEditProfileForm(true);
                            }}
                        >
                            <p className="font-black text-slate-900 text-lg leading-tight truncate">{user?.name}</p>
                            {user?.is_ustoz && (
                                <span className="inline-flex items-center gap-1 mt-1 px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 text-xs font-bold">
                                    <GraduationCap size={13} /> Ustoz
                                </span>
                            )}
                            <p className="text-sm text-slate-500 mt-0.5 truncate">
                                {user?.email || user?.phone_number}
                            </p>
                        </button>
                        <ChevronRight size={18} className="text-slate-300 shrink-0" />
                    </div>

                    {/* Premium card — 3 states */}
                    {user?.is_ustoz ? (
                        <div className="rounded-3xl bg-gradient-to-br from-amber-500 to-orange-600 text-white p-5 shadow-premium flex items-center gap-3">
                            <GraduationCap size={26} />
                            <div>
                                <p className="font-black">Ustoz — doimiy kirish</p>
                                <p className="text-sm text-white/85">Barcha kurslar ochiq · muddatsiz</p>
                            </div>
                        </div>
                    ) : activePackages.length > 0 ? (
                        <div className="space-y-3">
                            {activePackages.map((p) => (
                                <div key={p.package} className="rounded-3xl bg-brand-hero text-white p-5 shadow-premium flex items-center gap-3">
                                    <Crown size={22} className="shrink-0" />
                                    <div className="min-w-0 flex-1">
                                        <p className="font-black leading-tight">Premium: {packageLabel(p.package)}</p>
                                        {p.until && <p className="text-sm text-white/80 mt-0.5">{formatUntil(p.until)} gacha</p>}
                                    </div>
                                    <Link
                                        href={`/premium?package=${p.package}`}
                                        className="px-4 py-2 rounded-full bg-white/20 hover:bg-white/30 text-sm font-bold shrink-0 transition-colors"
                                    >
                                        Uzaytirish
                                    </Link>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="rounded-3xl border-2 border-dashed border-slate-300 bg-white/60 p-5 flex items-center gap-3">
                            <Crown size={22} className="text-primary shrink-0" />
                            <div className="min-w-0 flex-1">
                                <p className="font-black text-slate-900">Premium yo‘q</p>
                                <p className="text-sm text-slate-500">Barcha kurslarni ochish uchun</p>
                            </div>
                            <Link href="/premium" className="px-4 py-2.5 rounded-full bg-brand-ink text-white text-sm font-bold shrink-0">
                                Premium olish
                            </Link>
                        </div>
                    )}

                    {/* Test results */}
                    <div className="bg-white rounded-3xl border border-slate-100 shadow-soft overflow-hidden">
                        <button onClick={() => setShowTestHistory(!showTestHistory)} className={rowCls}>
                            <span className={tile}><CheckCircle2 size={18} /></span>
                            <span className="flex-1 font-bold text-slate-900">Test natijalari</span>
                            {typeof user?.tests_count === 'number' && (
                                <span className="text-sm font-semibold text-slate-400">{user.tests_count}</span>
                            )}
                            <ChevronRight size={16} className={`text-slate-300 transition-transform ${showTestHistory ? 'rotate-90' : ''}`} />
                        </button>
                        {showTestHistory && (
                            <div className="border-t border-slate-100 p-4 space-y-3 bg-slate-50/60">
                                {testHistory?.summary && (
                                    <div className="grid grid-cols-3 gap-2">
                                        {[
                                            { v: testHistory.summary.tests_count, l: 'test' },
                                            { v: `${Math.round(testHistory.summary.average_percent)}%`, l: 'o‘rtacha' },
                                            { v: `${Math.round(testHistory.summary.best_percent)}%`, l: 'eng yaxshi' },
                                        ].map((x) => (
                                            <div key={x.l} className="bg-white rounded-2xl py-2.5 text-center border border-slate-100">
                                                <p className="font-black text-slate-900">{x.v}</p>
                                                <p className="text-[11px] text-slate-500">{x.l}</p>
                                            </div>
                                        ))}
                                    </div>
                                )}
                                {testHistory?.data?.length ? (
                                    testHistory.data.map((item) => {
                                        const pct = Math.round(item.best_percent);
                                        const tone = pct >= 90 ? 'bg-emerald-50 text-emerald-700' : pct >= 70 ? 'bg-blue-50 text-primary' : 'bg-amber-50 text-amber-700';
                                        return (
                                            <button
                                                key={item.test_id}
                                                onClick={() => router.push(`/lessons/${item.lesson_id}/quiz/${item.test_id}?attempt=${item.last_attempt_id}`)}
                                                className="w-full flex items-center gap-3 p-3 bg-white rounded-2xl border border-slate-100 text-left hover:border-primary/30 transition-colors"
                                            >
                                                <span className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-black shrink-0 ${tone}`}>{pct}%</span>
                                                <span className="min-w-0 flex-1">
                                                    <span className="block font-bold text-slate-900 truncate">{item.test_title}</span>
                                                    <span className="block text-xs text-slate-500 truncate">
                                                        {item.course_name} · {formatUntil(item.last_finished_at)} · {item.attempts} urinish
                                                    </span>
                                                </span>
                                                <ChevronRight size={16} className="text-slate-300" />
                                            </button>
                                        );
                                    })
                                ) : (
                                    <p className="text-sm text-slate-500 text-center py-3">Hali test ishlanmagan.</p>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Activity */}
                    {activityStats && (
                        <div className="grid grid-cols-2 gap-3">
                            <div className="bg-white rounded-3xl border border-slate-100 shadow-soft p-4">
                                <p className="text-xs text-slate-500 mb-1">Jami ball</p>
                                <p className="text-2xl font-black text-slate-900 tabular-nums">{activityStats.total}</p>
                            </div>
                            <div className="bg-white rounded-3xl border border-slate-100 shadow-soft p-4">
                                <p className="text-xs text-slate-500 mb-1">O‘qish vaqti</p>
                                <p className="text-2xl font-black text-slate-900 tabular-nums">{formatTime(activityStats.total)}</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Column 2: settings */}
                <div className="space-y-4">
                    <div className="bg-white rounded-3xl border border-slate-100 shadow-soft divide-y divide-slate-100 overflow-hidden">
                        <a href="https://t.me/imedteam_feedback" target="_blank" rel="noopener noreferrer" className={rowCls}>
                            <span className={tile}><MessageSquare size={18} /></span>
                            <span className="flex-1 font-semibold text-slate-800">Fikr bildirish</span>
                            <ExternalLink size={15} className="text-slate-300" />
                        </a>
                        <a href="https://t.me/manager_iMedteam" target="_blank" rel="noopener noreferrer" className={rowCls}>
                            <span className={tile}><MessageCircle size={18} /></span>
                            <span className="flex-1 font-semibold text-slate-800">Adminga yozish</span>
                            <ExternalLink size={15} className="text-slate-300" />
                        </a>
                    </div>

                    <div className="bg-white rounded-3xl border border-slate-100 shadow-soft divide-y divide-slate-100 overflow-hidden">
                        <button onClick={() => setShowGuideModal(true)} className={rowCls}>
                            <span className={tile}><HelpCircle size={18} /></span>
                            <span className="flex-1 font-semibold text-slate-800">Yo‘riqnoma</span>
                            <ChevronRight size={16} className="text-slate-300" />
                        </button>
                        <Link href="/offerta" className={rowCls}>
                            <span className={tile}><FileText size={18} /></span>
                            <span className="flex-1 font-semibold text-slate-800">Ommaviy oferta</span>
                            <ChevronRight size={16} className="text-slate-300" />
                        </Link>
                    </div>

                    <div className="bg-white rounded-3xl border border-slate-100 shadow-soft divide-y divide-slate-100 overflow-hidden">
                        <button onClick={logout} className={`${rowCls} text-red-600`}>
                            <span className="w-10 h-10 rounded-xl bg-red-50 text-red-500 flex items-center justify-center shrink-0"><LogOut size={18} /></span>
                            <span className="flex-1 font-semibold">Hisobdan chiqish</span>
                        </button>
                        <button onClick={() => setShowDeleteConfirm(true)} className={`${rowCls} text-slate-500`}>
                            <span className="w-10 h-10 rounded-xl bg-slate-100 text-slate-400 flex items-center justify-center shrink-0"><Trash2 size={18} /></span>
                            <span className="flex-1 font-semibold">Hisobni o‘chirish</span>
                        </button>
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
