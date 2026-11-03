import { useState, useEffect } from 'react';
import { X, Check, AlertCircle, Loader2 } from 'lucide-react';
import { promocodeService } from '@/services';
import { PremiumPackage, PromocodeRes } from '@/types/mobile-api';
import { formatSom } from '@/lib/premium';

interface PromoCodeModalProps {
    isOpen: boolean;
    onClose: () => void;
    packageName: string;
    pkg: PremiumPackage;
    basePrice: number;
    onPurchase: (promoId?: string) => void;
    isPurchasing: boolean;
}

export function PromoCodeModal({
    isOpen,
    onClose,
    packageName,
    pkg,
    basePrice,
    onPurchase,
    isPurchasing,
}: PromoCodeModalProps) {
    const [promoCode, setPromoCode] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [appliedPromo, setAppliedPromo] = useState<PromocodeRes | null>(null);

    useEffect(() => {
        if (isOpen) {
            setPromoCode('');
            setError('');
            setAppliedPromo(null);
        }
    }, [isOpen, pkg]);

    const handleCheckPromo = async () => {
        if (!promoCode.trim()) return;

        setLoading(true);
        setError('');
        setAppliedPromo(null);

        try {
            const res = await promocodeService.check({
                promocode: promoCode,
                type: 'premium',
                package: pkg,
            });

            if (res.is_valid) {
                setAppliedPromo(res);
            } else {
                setError(res.message || 'Promokod yaroqsiz');
            }
        } catch (err: any) {
            setError(err.message || 'Tekshirishda xatolik yuz berdi');
        } finally {
            setLoading(false);
        }
    };

    const handleConfirm = () => {
        if (appliedPromo?.is_valid) {
            onPurchase(appliedPromo.promocode_id || undefined);
        } else {
            onPurchase();
        }
    };

    const finalPrice = appliedPromo?.total_amount ?? basePrice;
    const discountAmount = appliedPromo?.discount_amount ?? 0;

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden">
                <div className="bg-slate-50 px-6 py-4 flex items-center justify-between border-b border-gray-100">
                    <h3 className="text-lg font-bold text-gray-900">Promokod bormi?</h3>
                    <button onClick={onClose} className="p-2 hover:bg-white rounded-full text-gray-400">
                        <X size={20} />
                    </button>
                </div>

                <div className="p-6 space-y-6">
                    <div>
                        <p className="text-sm text-gray-500 font-medium mb-1">Tanlangan paket:</p>
                        <p className="text-xl font-black text-gray-900">{packageName}</p>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700">Promokod kiritish</label>
                        <div className="relative">
                            <input
                                type="text"
                                value={promoCode}
                                onChange={(e) => {
                                    setPromoCode(e.target.value.toUpperCase());
                                    setError('');
                                    if (appliedPromo) setAppliedPromo(null);
                                }}
                                placeholder="Masalan: BAHOR10"
                                className={`w-full pl-4 pr-12 py-3.5 bg-slate-50 border-2 rounded-xl font-bold text-gray-900 placeholder:text-gray-400 outline-none uppercase ${error ? 'border-red-200 bg-red-50' :
                                    appliedPromo ? 'border-emerald-200 bg-emerald-50' :
                                        'border-transparent focus:bg-white focus:border-primary/20'
                                    }`}
                                disabled={loading}
                            />
                            <div className="absolute right-2 top-1/2 -translate-y-1/2">
                                {loading ? (
                                    <Loader2 className="w-5 h-5 animate-spin text-primary" />
                                ) : appliedPromo ? (
                                    <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center">
                                        <Check size={18} strokeWidth={3} />
                                    </div>
                                ) : (
                                    <button
                                        onClick={handleCheckPromo}
                                        disabled={!promoCode || loading}
                                        className="p-2 text-sm font-bold text-primary hover:bg-primary/10 rounded-lg disabled:opacity-50"
                                    >
                                        TEKSHIRISH
                                    </button>
                                )}
                            </div>
                        </div>

                        {error && (
                            <div className="flex items-center gap-2 text-red-500 text-xs font-bold">
                                <AlertCircle size={14} />
                                {error}
                            </div>
                        )}
                    </div>

                    <div className="bg-slate-50 rounded-2xl p-4 border border-gray-100">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-gray-500 font-medium text-sm">Asl narxi</span>
                            <span className={`font-bold ${appliedPromo ? 'text-gray-400 line-through' : 'text-gray-900'}`}>
                                {formatSom(basePrice)}
                            </span>
                        </div>
                        {appliedPromo && (
                            <div className="flex justify-between items-center mb-2 text-emerald-600">
                                <span className="font-bold text-sm">Chegirma</span>
                                <span className="font-bold">-{formatSom(discountAmount)}</span>
                            </div>
                        )}
                        <div className="pt-3 mt-1 border-t border-gray-200 flex justify-between items-center">
                            <span className="text-gray-900 font-black text-sm uppercase tracking-wide">Jami to'lov</span>
                            <span className="text-2xl font-black text-primary">{formatSom(finalPrice)}</span>
                        </div>
                    </div>

                    <button
                        onClick={handleConfirm}
                        disabled={isPurchasing}
                        className="w-full py-4 rounded-xl font-black bg-primary text-white text-lg disabled:opacity-70 flex items-center justify-center gap-2"
                    >
                        {isPurchasing ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                Yaratilmoqda...
                            </>
                        ) : (
                            'To\'lovga o\'tish'
                        )}
                    </button>

                    {!appliedPromo && !isPurchasing && (
                        <button onClick={handleConfirm} className="w-full py-3 text-gray-400 font-bold text-sm">
                            Promokodsiz davom etish
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
