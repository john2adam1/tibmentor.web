'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { premiumService } from '@/services';
import { PremiumPackage, PremiumPackageOffer, PremiumRes } from '@/types/mobile-api';
import { formatSom, formatUntil, packageLabel } from '@/lib/premium';
import { PromoCodeModal } from '@/components/student/PromoCodeModal';
import Link from 'next/link';
import { ChevronLeft, Crown } from 'lucide-react';

function PremiumContent() {
    const searchParams = useSearchParams();
    const preselect = searchParams?.get('package') as PremiumPackage | null;

    const [data, setData] = useState<PremiumRes | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selected, setSelected] = useState<PremiumPackageOffer | null>(null);
    const [promoOpen, setPromoOpen] = useState(false);
    const [purchasing, setPurchasing] = useState(false);
    const [chosen, setChosen] = useState<PremiumPackage | null>(preselect);

    const load = async () => {
        try {
            setLoading(true);
            const res = await premiumService.getPremium();
            setData(res);
        } catch (err: any) {
            setError(err.message || 'Premium maʼlumotlarini yuklab boʻlmadi');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        load();
    }, []);

    const handleBuy = (pkg: PremiumPackageOffer) => {
        if (!pkg.price) return;
        setSelected(pkg);
        setPromoOpen(true);
    };

    const handleConfirm = async (promoId?: string) => {
        if (!selected) return;
        setPurchasing(true);
        try {
            const order = await premiumService.createOrder({
                package: selected.package,
                promocode_id: promoId,
            });
            if (order.url) {
                window.location.assign(order.url);
                return;
            }
            await load();
            setPromoOpen(false);
        } catch (err: any) {
            setError(err.message || 'Toʻlovni boshlashda xatolik');
        } finally {
            setPurchasing(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[60vh]">
                <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
            </div>
        );
    }

    if (error && !data) {
        return <p className="text-center text-red-500 font-medium py-20">{error}</p>;
    }

    if (data?.is_ustoz) {
        return (
            <div className="max-w-xl mx-auto py-16">
                <div className="bg-white rounded-3xl border border-slate-100 p-10 text-center shadow-soft">
                    <p className="text-[10px] font-black uppercase tracking-widest text-primary mb-3">Ustoz</p>
                    <h1 className="text-3xl font-black text-gray-900 mb-3">Ustoz — doimiy kirish</h1>
                    <p className="text-gray-500 font-medium">Barcha kurslar sizga ochiq. Toʻlov shart emas.</p>
                </div>
            </div>
        );
    }

    const packages = data?.packages || [];
    const ordered = [...packages].sort((a, b) => {
        if (preselect && a.package === preselect) return -1;
        if (preselect && b.package === preselect) return 1;
        return 0;
    });
    const current = ordered.find((p) => p.package === chosen) || ordered[0];
    const PKG_STYLE: Record<string, { emoji: string; tile: string; desc: string }> = {
        fundamental: { emoji: '🫀', tile: 'bg-rose-50', desc: 'Anatomiya, fiziologiya, biokimyo' },
        preclinical: { emoji: '🔬', tile: 'bg-blue-50', desc: 'Patologiya, farmakologiya' },
        clinical: { emoji: '🩺', tile: 'bg-sky-50', desc: 'Gematologiya, pulmonologiya, pediatriya' },
    };

    return (
        <div className="max-w-3xl mx-auto pb-32 md:pb-10">
            {/* Header */}
            <div className="flex items-center gap-3 mb-5">
                <Link
                    href="/dashboard"
                    aria-label="Orqaga"
                    className="w-10 h-10 rounded-full bg-white shadow-soft flex items-center justify-center text-slate-700 hover:text-primary shrink-0"
                >
                    <ChevronLeft size={20} />
                </Link>
                <h1 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">Premium</h1>
            </div>

            {/* Hero */}
            <div className="rounded-3xl bg-brand-hero text-white p-6 md:p-8 shadow-premium mb-3">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 text-[11px] font-bold tracking-widest">
                    <Crown size={12} fill="currentColor" /> PREMIUM
                </span>
                <p className="text-3xl md:text-4xl font-black mt-3 mb-4">
                    {current && current.price > 0 ? formatSom(current.price) : 'Narx'}
                    <span className="text-lg font-bold text-white/70"> / oy</span>
                </p>
                <ul className="space-y-1.5 text-sm md:text-base text-white/90 list-disc pl-5">
                    <li>Fundamental, preklinik yoki klinik fanlar</li>
                    <li>Har bir modul alohida, har oy to‘lov</li>
                </ul>
            </div>
            <p className="text-center text-sm text-slate-500 mb-6">Muddat tanlash yo‘q — faqat oylik</p>

            {error && <div className="p-4 mb-4 bg-red-50 text-red-600 rounded-2xl text-sm font-medium">{error}</div>}

            <p className="text-sm font-bold text-slate-700 mb-3 px-1">Qaysi modulni ochmoqchisiz? Har biri alohida, oylik.</p>
            <div className="space-y-3 lg:grid lg:grid-cols-3 lg:gap-4 lg:space-y-0">
                {ordered.map((pkg) => {
                    const st = PKG_STYLE[pkg.package] || PKG_STYLE.fundamental;
                    const selectedCard = current?.package === pkg.package;
                    const canBuy = pkg.price > 0;
                    return (
                        <button
                            key={pkg.package}
                            onClick={() => setChosen(pkg.package)}
                            className={`w-full text-left flex lg:flex-col lg:items-start items-center gap-4 p-4 bg-white rounded-3xl border-2 transition-all ${
                                selectedCard ? 'border-primary shadow-premium' : 'border-slate-100 shadow-soft hover:border-primary/30'
                            }`}
                        >
                            <span className={`w-12 h-12 rounded-2xl ${st.tile} flex items-center justify-center text-2xl shrink-0`}>
                                {st.emoji}
                            </span>
                            <span className="min-w-0 flex-1">
                                <span className="block font-black text-slate-900 leading-snug">{packageLabel(pkg.package)}</span>
                                <span className="block text-sm text-slate-500">{st.desc}</span>
                                {pkg.is_active && (
                                    <span className="inline-block mt-1 text-xs font-bold text-emerald-600">
                                        Faol{pkg.until ? ` · ${formatUntil(pkg.until)} gacha` : ''}
                                    </span>
                                )}
                            </span>
                            <span className="text-sm font-black text-slate-900 shrink-0 text-right">
                                {canBuy ? formatSom(pkg.price) : '—'}
                                {canBuy && <span className="text-xs font-semibold text-slate-400"> / oy</span>}
                            </span>
                        </button>
                    );
                })}
            </div>
            <p className="text-sm text-slate-500 mt-4 px-1">Bir nechta modulni ham olish mumkin — har biri o‘z to‘lovi bilan.</p>

            {/* CTA */}
            <div className="fixed bottom-[calc(4.25rem+env(safe-area-inset-bottom))] inset-x-4 z-30 md:static md:mt-8 md:inset-auto space-y-2">
                {current && current.price > 0 ? (
                    <button
                        onClick={() => handleBuy(current)}
                        className="w-full py-4 bg-brand-gradient text-white rounded-2xl font-bold shadow-premium hover:opacity-95 active:scale-[0.99] transition-all"
                    >
                        {packageLabel(current.package)} Premiumini {current.is_active ? 'uzaytirish' : 'olish'}
                    </button>
                ) : (
                    <p className="text-center text-sm font-semibold text-slate-400 py-3">Narx hali belgilanmagan</p>
                )}
                <p className="text-center text-xs text-slate-500">To‘lov Click orqali</p>
            </div>

            {selected && (
                <PromoCodeModal
                    isOpen={promoOpen}
                    onClose={() => setPromoOpen(false)}
                    packageName={packageLabel(selected.package)}
                    pkg={selected.package}
                    basePrice={selected.price}
                    onPurchase={handleConfirm}
                    isPurchasing={purchasing}
                />
            )}
        </div>
    );
}

export default function PremiumPage() {
    return (
        <Suspense fallback={<div className="flex justify-center py-20"><div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" /></div>}>
            <PremiumContent />
        </Suspense>
    );
}
