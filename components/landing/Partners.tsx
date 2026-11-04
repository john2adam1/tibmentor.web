import { BRAND_NAME } from '@/lib/brand';
import BrandWordmark from '@/components/common/BrandWordmark';

export default function Partners() {
    return (
        <section className="py-10 bg-slate-50 relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-6">
                <div className="marquee relative">
                    <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-slate-50 to-transparent z-10"></div>
                    <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-slate-50 to-transparent z-10"></div>

                    <div className="marquee-track py-2">
                        {[...Array(20)].map((_, i) => (
                            <div
                                key={i}
                                className="flex items-center gap-3 px-6 py-3 rounded-[1.5rem] bg-white border border-slate-100 shadow-lg shadow-slate-200/20 min-w-[180px] group hover:border-primary/20 transition-all duration-500"
                            >
                                <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:rotate-12 transition-transform">
                                    <img src="/assets/logo.png" alt={BRAND_NAME} className="w-8 h-8 object-contain" />
                                </div>
                                <BrandWordmark className="text-base" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
