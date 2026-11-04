import { useAuth } from '@/lib/auth-context';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { appRouteService } from '@/services';
import { AppRouteRes } from '@/types/mobile-api';

export default function Hero() {
    const { isAuthenticated } = useAuth();
    const authPath = isAuthenticated ? '/dashboard' : '/auth/login';
    const [appLinks, setAppLinks] = useState<{ apple?: string; google?: string; }>({});

    useEffect(() => {
        const fetchRoutes = async () => {
            try {
                const response: any = await appRouteService.getAll();
                let routeData = null;
                if (response && response.data && Array.isArray(response.data) && response.data.length > 0) {
                    routeData = response.data[0];
                } else if (Array.isArray(response) && response.length > 0) {
                    routeData = response[0];
                }

                if (routeData && routeData.app_links) {
                    setAppLinks(routeData.app_links);
                }
            } catch (error) {
                console.error("Failed to fetch app routes", error);
            }
        };
        fetchRoutes();
    }, []);

    const iosAppUrl = appLinks?.apple || "https://apps.apple.com/uz/app/imed-team/id6745555493";
    const androidAppUrl = appLinks?.google || "https://minio.imedteam.uz/imed/imedteam_3.0.0_17.apk";

    return (
        <section id="home" className="relative overflow-hidden pt-20 pb-10 lg:pt-32 lg:pb-16">
            <div className="absolute inset-0 -z-10 overflow-hidden">
                <div className="absolute top-0 right-0 w-[50rem] h-[50rem] rounded-full bg-primary/5 blur-[120px] -translate-y-1/2 translate-x-1/2"></div>
                <div className="absolute bottom-0 left-0 w-[40rem] h-[40rem] rounded-full bg-primary/10 blur-[100px] translate-y-1/2 -translate-x-1/2"></div>
            </div>

            <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
                <div className="reveal">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-primary/10 text-primary text-sm font-bold mb-8 animate-bounce-subtle">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                        </span>
                        TibMentor — Tibbiyot Olami!
                    </div>

                    <h1 className="text-5xl sm:text-7xl font-black tracking-tight text-slate-900 leading-[1.1]">
                        Tibbiyotni biz bilan <br />
                        <span className="text-primary italic">Tez, oson va sifatli </span>
                        o‘rganing!
                    </h1>

                    <p className="mt-8 font-bold text-slate-900 text-xl leading-relaxed max-w-xl">
                        Platformamizga websitemiz orqali kirishingiz mumkin
                    </p>

                    <div className="mt-10">
                        <Link
                            href={authPath}
                            className="w-full sm:w-auto inline-flex items-center justify-center px-10 py-5 rounded-2xl bg-primary text-white text-lg font-black hover:bg-primary/90 hover:shadow-xl hover:shadow-primary/40 transition-all shadow-2xl shadow-primary/20 active:scale-95 whitespace-nowrap"
                        >
                            Platformaga kirish
                        </Link>
                    </div>

                    <h3 className="mt-8 text-slate-900 font-bold text-xl leading-snug max-w-lg">
                        Yoki mobil ilovamizni telefoningizga yuklab olib foydalanishingiz mumkin
                    </h3>

                    <div className="mt-8 flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                        <a
                            href={iosAppUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full sm:w-auto group relative px-7 py-4 bg-slate-950 text-white rounded-2xl font-bold flex items-center justify-center sm:justify-start gap-4 hover:bg-slate-900 transition-all duration-300 shadow-xl hover:shadow-slate-950/40 active:scale-95 border border-white/5 overflow-hidden"
                        >
                            <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            <img src="https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg" alt="iOS" className="w-7 h-7 brightness-0 invert" />
                            <div className="flex flex-col items-start leading-none text-left relative z-10">
                                <span className="text-[10px] uppercase tracking-widest opacity-50 mb-1">Download on</span>
                                <span className="text-lg font-extrabold tracking-tight">App Store</span>
                            </div>
                        </a>

                        <a
                            href={androidAppUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full sm:w-auto group relative px-7 py-4 bg-slate-950 text-white rounded-2xl font-bold flex items-center justify-center sm:justify-start gap-4 hover:bg-slate-900 transition-all duration-300 shadow-xl hover:shadow-slate-950/40 active:scale-95 border border-white/5 overflow-hidden"
                        >
                            <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            <img src="https://www.vectorlogo.zone/logos/android/android-icon.svg" alt="Android" className="w-7 h-7" />
                            <div className="flex flex-col items-start leading-none text-left relative z-10">
                                <span className="text-[10px] uppercase tracking-widest opacity-50 mb-1">Yuklab olish</span>
                                <span className="text-lg font-extrabold tracking-tight">Android</span>
                            </div>
                        </a>
                    </div>
                </div>

                <div className="relative lg:block hidden">
                    <div className="absolute inset-0 bg-primary/10 rounded-[3rem] rotate-3 scale-105 blur-2xl"></div>
                    <div className="relative bg-white p-4 rounded-[3rem] shadow-2xl shadow-primary/10 border border-slate-100 overflow-hidden transform hover:-rotate-1 transition-transform duration-700">
                        <img
                            src="/assets/masterklass.jpg"
                            alt="Medical Students Studying"
                            className="w-full h-full object-cover rounded-[2.5rem]"
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}
