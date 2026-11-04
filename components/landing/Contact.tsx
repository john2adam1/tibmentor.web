export default function Contact() {
    return (
        <section id="contact" className="py-12 bg-slate-900 relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(var(--primary),0.05),transparent)] opacity-20"></div>
            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="grid lg:grid-cols-2 gap-20 items-center">
                    <div>
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-brand-cyan/10 text-brand-cyan text-sm font-bold mb-8">
                            ALOQA
                        </div>
                        <h2 className="text-4xl sm:text-6xl font-bold text-white tracking-tight leading-tight mb-8">
                            Savollaringiz bormi? <br />
                            <span className="text-brand-cyan">Biz sizga yordam beramiz!</span>
                        </h2>
                        <p className="text-slate-400 text-xl font-medium leading-relaxed mb-12 max-w-lg">
                            Professional jamoamiz sizni qiziqtirgan barcha savollarga javob berishga tayyor.
                        </p>

                        <div className="grid sm:grid-cols-2 gap-8">
                            {[
                                { icon: '📍', label: 'Manzil', value: 'Farg\'ona shahar' },
                                { icon: '📞', label: 'Telefon', value: '+998 55 055 13 14' },
                                { icon: '✉️', label: 'Email', value: 'imedteam1@gmail.com' },
                                { icon: '🕒', label: 'Ish vaqti', value: 'Du–Shan 10:00–18:00' }
                            ].map((item, i) => (
                                <div key={i} className="flex flex-col gap-2">
                                    <span className="text-3xl mb-2">{item.icon}</span>
                                    <span className="text-slate-500 uppercase tracking-widest text-[10px] font-bold">{item.label}</span>
                                    <span className="text-white font-bold text-lg">{item.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="reveal">
                        <div className="bg-white rounded-3xl p-12 shadow-soft hover:shadow-card transition-all duration-300 relative">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                            <h3 className="text-3xl font-bold text-slate-900 mb-8">Telegram orqali bog‘lanish</h3>
                            <p className="text-slate-500 font-medium mb-10 leading-relaxed">
                                Eng tezkor javobni bizning rasmiy Telegram botimiz yoki adminimiz orqali olishingiz mumkin.
                            </p>

                            <a
                                href="https://t.me/iMed_team"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-center gap-4 w-full py-6 rounded-2xl bg-primary text-white font-bold text-xl shadow-lg hover:bg-primary-600 active:scale-[0.98] transition-all duration-300"
                            >
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M9.036 15.28 8.87 19.1c.34 0 .49-.15.67-.33l1.61-1.56 3.34 2.45c.61.33 1.06.16 1.22-.56l2.21-10.37c.2-.89-.32-1.23-.91-1.02l-12.94 5c-.88.34-.86.84-.15 1.06l3.31 1.03 7.69-4.86c.36-.22.7-.1.42.14" />
                                </svg>
                                @iMed_team
                            </a>

                            <div className="mt-10 pt-10 border-t border-slate-100 text-center">
                                <p className="text-slate-400 font-bold text-sm tracking-wide">
                                    BIZNING RASMIY KANALIMIZ:
                                    <a href="https://t.me/iMed_team" className="text-brand-cyan ml-2 hover:underline">@iMed_team</a>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
