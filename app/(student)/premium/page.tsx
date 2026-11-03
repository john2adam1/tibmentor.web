'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { premiumService } from '@/services';
import { PremiumPackage, PremiumPackageOffer, PremiumRes } from '@/types/mobile-api';
import { formatSom, formatUntil, packageLabel } from '@/lib/premium';
import { PromoCodeModal } from '@/components/student/PromoCodeModal';
import Link from 'next/link';

function PremiumContent() {
    const searchParams = useSearchParams();
    const preselect = searchParams?.get('package') as PremiumPackage | null;

    const [data, setData] = useState<PremiumRes | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selected, setSelected] = useState<PremiumPackageOffer | null>(null);
    const [promoOpen, setPromoOpen] = useState(false);
    const [purchasing, setPurchasing] = useState(false);

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
                <div className="bg-white rounded-[2.5rem] border border-gray-100 p-10 text-center shadow-soft">
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

    return (
        <div className="max-w-4xl mx-auto space-y-10">
            <div>
                <h1 className="text-4xl font-black text-gray-900 tracking-tight mb-2">Premium</h1>
                <p className="text-gray-400 font-medium">Har bir paket alohida, oylik Click toʻlovi orqali ochiladi.</p>
            </div>

            {error && (
                <div className="p-4 bg-red-50 text-red-600 rounded-2xl text-sm font-medium">{error}</div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {ordered.map((pkg) => {
                    const highlighted = preselect === pkg.package;
                    const canBuy = pkg.price > 0;
                    return (
                        <div
                            key={pkg.package}
                            className={`bg-white rounded-[2rem] border p-8 shadow-soft flex flex-col ${highlighted ? 'border-primary ring-2 ring-primary/10' : 'border-gray-100'}`}
                        >
                            <h2 className="text-xl font-black text-gray-900 mb-2">{packageLabel(pkg.package)}</h2>
                            {pkg.is_active ? (
                                <p className="text-sm font-bold text-emerald-600 mb-6">
                                    Faol{pkg.until ? ` · ${formatUntil(pkg.until)} gacha` : ''}
                                </p>
                            ) : (
                                <p className="text-sm font-bold text-gray-400 mb-6">Faol emas</p>
                            )}
                            <p className="text-3xl font-black text-gray-900 mb-8">
                                {canBuy ? formatSom(pkg.price) : '—'}
                                {canBuy && <span className="text-sm font-bold text-gray-400"> / oy</span>}
                            </p>
                            {canBuy ? (
                                <button
                                    onClick={() => handleBuy(pkg)}
                                    className="mt-auto w-full py-4 bg-primary text-white rounded-2xl font-black uppercase tracking-widest text-xs"
                                >
                                    {pkg.is_active ? 'Uzaytirish' : 'Sotib olish'}
                                </button>
                            ) : (
                                <p className="mt-auto text-xs font-bold text-gray-400">Narx hali belgilanmagan</p>
                            )}
                        </div>
                    );
                })}
            </div>

            <Link href="/courses" className="inline-block text-sm font-bold text-primary">
                Kurslarga qaytish
            </Link>

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
