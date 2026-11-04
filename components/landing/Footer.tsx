import Link from 'next/link';
import BrandWordmark from '@/components/common/BrandWordmark';
import { BRAND_NAME } from '@/lib/brand';

export default function Footer() {
    return (
        <footer className="bg-white border-t border-slate-100 pb-24 lg:pb-0">
            <div className="max-w-7xl mx-auto px-6 py-20">
                <div className="grid md:grid-cols-4 gap-12">
                    <div className="col-span-2">
                        <Link href="/" className="flex items-center gap-3 mb-8 group">
                            <div className="w-12 h-12 rounded-2xl bg-white border border-slate-100 flex items-center justify-center shadow-lg shadow-primary/10">
                                <img src="/assets/logo.png" alt={BRAND_NAME} className="w-8 h-8 object-contain" />
                            </div>
                            <BrandWordmark className="text-2xl" />
                        </Link>
                        <p className="text-slate-500 font-medium text-lg max-w-sm leading-relaxed">
                            O‘zbekiston tibbiyotini yangi darajaga olib chiqish — bizning eng ustuvor vazifamiz!
                        </p>
                    </div>

                    <div>
                        <h4 className="font-black text-slate-900 uppercase tracking-widest text-sm mb-6">IJTIMOIY TARMOQLAR</h4>
                        <div className="space-y-4">
                            {[
                                { name: 'Instagram', url: 'https://instagram.com/imed_team', icon: 'M12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10zm0-5c2.7 0 3.03.01 4.1.06 1.06.05 1.78.22 2.41.46.66.26 1.22.61 1.77 1.16.55.55.9 1.11 1.16 1.77.24.63.41 1.35.46 2.41.05 1.07.06 1.4.06 4.1s-.01 3.03-.06 4.1c-.05 1.06-.22 1.78-.46 2.41a4.9 4.9 0 0 1-1.16 1.77 4.9 4.9 0 0 1-1.77 1.16c-.63.24-1.35.41-2.41.46-1.07.05-1.4.06-4.1.06s-3.03-.01-4.1-.06c-1.06-.05-1.78-.22-2.41-.46a4.9 4.9 0 0 1-1.77-1.16 4.9 4.9 0 0 1-1.16-1.77c-.24-.63-.41-1.35-.46-2.41C2.01 15.03 2 14.7 2 12s.01-3.03.06-4.1c.05-1.06.22-1.78.46-2.41.26-.66.61-1.22 1.16-1.77.55-.55 1.11-.9 1.77-1.16.63-.24 1.35-.41 2.41-.46C8.97 2.01 9.3 2 12 2zm6.75-.9a1.15 1.15 0 1 0 0 2.3 1.15 1.15 0 0 0 0-2.3z' },
                                { name: 'YouTube', url: 'http://www.youtube.com/@imedteam', icon: 'M23.5 7.2s-.23-1.64-.95-2.36c-.9-.95-1.9-.95-2.36-1C16.9 3.5 12 3.5 12 3.5h0s-4.9 0-8.19.34c-.46.05-1.46.05-2.36 1C.73 5.56.5 7.2.5 7.2S.25 9.12.25 11.04v1.92C.25 14.88.5 16.8.5 16.8s.23 1.64.95 2.36c.9.95 2.08.92 2.6 1.02 1.88.18 7.95.34 7.95.34s4.9 0 8.19-.34c.46-.05 1.46-.05 2.36-1 .72-.72.95-2.36.95-2.36s.25-1.92.25-3.84v-1.92c0-1.92-.25-3.84-.25-3.84zM9.75 14.5V8.5l6 3-6 3z' },
                                { name: 'Telegram', url: 'https://t.me/imedteam', icon: 'M9.036 15.28 8.87 19.1c.34 0 .49-.15.67-.33l1.61-1.56 3.34 2.45c.61.33 1.06.16 1.22-.56l2.21-10.37c.2-.89-.32-1.23-.91-1.02l-12.94 5c-.88.34-.86.84-.15 1.06l3.31 1.03 7.69-4.86c.36-.22.7-.1.42.14' }
                            ].map((social) => (
                                <a
                                    key={social.name}
                                    href={social.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-3 text-slate-500 hover:text-primary font-bold transition-colors group"
                                >
                                    <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                            <path d={social.icon} />
                                        </svg>
                                    </div>
                                    {social.name}
                                </a>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="border-t border-slate-50 pt-10 mt-10">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-sm font-bold text-slate-400">
                        <p>© {new Date().getFullYear()} {BRAND_NAME}. Barcha huquqlar himoyalangan.</p>
                        <div className="flex items-center gap-8">
                            <a href="#" className="hover:text-primary transition-colors">Maxfiylik siyosati</a>
                            <a href="#" className="hover:text-primary transition-colors">Foydalanish shartlari</a>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
